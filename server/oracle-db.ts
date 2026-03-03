/**
 * Oracle Database Connection Service
 *
 * Provides connection pooling and query execution for Oracle databases.
 * 
 * Connection resolution order:
 *   1. Try PLE-DB lookup (Oracle 11g – requires Thick Mode / Oracle Instant Client)
 *   2. Fallback to static JDBC URLs from oracle-config.ts
 *
 * Thick Mode is attempted once at startup. If Oracle Instant Client is not
 * installed, the module stays in Thin Mode and PLE lookups are skipped.
 */
import oracledb from "oracledb";
import {
  PLE_CONFIG,
  getFallbackDbConfig,
  getPleDbUrlQuery,
  type JdbcUrl,
} from "./oracle-config";

// ─── Thick Mode initialisation ───

let thickModeAvailable = false;
let thickModeChecked = false;

/**
 * Try to enable Thick Mode once. Logs the result.
 * Thick Mode is required for Oracle 11g (PLE-DB).
 */
function tryInitThickMode(): void {
  if (thickModeChecked) return;
  thickModeChecked = true;

  // Common Oracle Instant Client paths on Linux
  const searchPaths = [
    process.env.ORACLE_CLIENT_LIB,          // explicit env var
    "/usr/lib/oracle/21/client64/lib",
    "/usr/lib/oracle/19.23/client64/lib",
    "/usr/lib/oracle/19/client64/lib",
    "/opt/oracle/instantclient_21_0",
    "/opt/oracle/instantclient_19_23",
    "/opt/oracle/instantclient_19_0",
    "/opt/oracle/instantclient",
    undefined, // try without explicit path (LD_LIBRARY_PATH)
  ].filter(Boolean) as (string | undefined)[];

  for (const libDir of searchPaths) {
    try {
      if (libDir) {
        oracledb.initOracleClient({ libDir });
      } else {
        oracledb.initOracleClient();
      }
      thickModeAvailable = true;
      console.log(`[Oracle] ✓ Thick Mode enabled (libDir=${libDir ?? "system default"}). PLE-DB lookup available.`);
      return;
    } catch (err) {
      // DPI-1047: Cannot locate a 64-bit Oracle Client library → try next path
      const msg = (err as Error).message || "";
      if (!msg.includes("DPI-1047") && !msg.includes("DPI-1072")) {
        // Already initialised or unexpected error
        if (msg.includes("already been called")) {
          thickModeAvailable = true;
          console.log(`[Oracle] ✓ Thick Mode was already initialised.`);
          return;
        }
      }
    }
  }

  console.log(`[Oracle] ℹ Thick Mode not available (Oracle Instant Client not found). PLE-DB lookup will be skipped; using static fallback URLs.`);
}

// Run once on module load
tryInitThickMode();

// ─── Connection pool cache ───

const poolCache = new Map<string, oracledb.Pool>();

export interface OracleConnectParams {
  user: string;
  password: string;
  connectString: string;
}

/**
 * Convert a raw connect string from JDBC URL format to node-oracledb format.
 *
 * Oracle distinguishes:
 *   host:port:SID       → TNS DESCRIPTION (required for SID-based connections)
 *   host:port/SERVICE   → Easy Connect //host:port/SERVICE
 */
function buildConnectString(raw: string): string {
  if (raw.startsWith("//") || raw.startsWith("(")) return raw;

  // host:port/SERVICE_NAME → Easy Connect
  if (raw.includes("/")) {
    return `//${raw}`;
  }

  const parts = raw.split(":");
  if (parts.length === 3) {
    const [host, port, sid] = parts;
    const tns = `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${host})(PORT=${port}))(CONNECT_DATA=(SID=${sid})))`;
    console.log(`[Oracle] SID-format detected → TNS descriptor: ${tns}`);
    return tns;
  }

  if (parts.length === 2) {
    return `//${raw}`;
  }

  return raw;
}

/**
 * Get or create a connection pool for the given parameters.
 */
async function getPool(params: OracleConnectParams): Promise<oracledb.Pool> {
  const connectString = buildConnectString(params.connectString);
  // Use the full connect string in the key to avoid collisions between databases
  // that share the same host/port but differ only in SID (e.g. MAMAS vs ADS on same scan listener)
  const key = `${params.user}@${connectString}`;

  console.log(`[Oracle] getPool: user=${params.user} rawConnectString="${params.connectString}"`);
  console.log(`[Oracle]   → resolved connectString="${connectString}"`);

  const existing = poolCache.get(key);
  if (existing) {
    console.log(`[Oracle] Reusing existing pool for ${key}`);
    try {
      const conn = await existing.getConnection();
      await conn.close();
      return existing;
    } catch (err) {
      console.warn(`[Oracle] Existing pool dead (${(err as Error).message}), recreating...`);
      try { await existing.close(0); } catch { /* ignore */ }
      poolCache.delete(key);
    }
  }

  console.log(`[Oracle] Creating new pool for ${key}...`);
  try {
    const pool = await oracledb.createPool({
      user: params.user,
      password: params.password,
      connectString,
      poolMin: 0,
      poolMax: 4,
      poolTimeout: 60,
      queueTimeout: 30_000,
    });
    console.log(`[Oracle] Pool created successfully for ${key}`);
    poolCache.set(key, pool);
    return pool;
  } catch (err) {
    console.error(`[Oracle] Failed to create pool: ${(err as Error).message}`);
    throw err;
  }
}

/**
 * Execute a SQL query against an Oracle database.
 */
export async function executeOracleQuery(
  params: OracleConnectParams,
  sql: string
): Promise<Record<string, any>[]> {
  let connection: oracledb.Connection | null = null;

  try {
    const pool = await getPool(params);
    console.log(`[Oracle] Getting connection from pool...`);
    connection = await pool.getConnection();
    console.log(`[Oracle] Executing query (${sql.length} chars)...`);

    const result = await connection.execute(sql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      maxRows: 15000,
    });

    const rowCount = (result.rows as any[])?.length ?? 0;
    console.log(`[Oracle] Query returned ${rowCount} row(s).`);
    return (result.rows as Record<string, any>[]) ?? [];
  } catch (err) {
    console.error(`[Oracle] Query execution failed: ${(err as Error).message}`);
    throw err;
  } finally {
    if (connection) {
      try { await connection.close(); } catch { /* ignore */ }
    }
  }
}

// ─── PLE-DB Lookup ───

/**
 * Parse a JDBC URL returned by PLE-DB into OracleConnectParams.
 * Format: jdbc:oracle:thin:user/pass@host:port:sid
 *     or: jdbc:oracle:thin:user/pass@host:port/service
 */
function parseJdbcToParams(jdbc: string): OracleConnectParams {
  const match = jdbc.match(/jdbc:oracle:thin:(?:@)?(.+?)\/(.+?)@(.+)/);
  if (!match) throw new Error(`Cannot parse JDBC URL from PLE: ${jdbc}`);
  return {
    user: match[1],
    password: match[2],
    connectString: match[3],
  };
}

/**
 * Try to resolve connection params from PLE-DB.
 * Returns null if PLE is not reachable or Thick Mode is unavailable.
 */
async function lookupFromPle(
  env: string,
  app: string,
  region: string
): Promise<OracleConnectParams | null> {
  if (!thickModeAvailable) {
    console.log(`[Oracle-PLE] Skipping PLE lookup (Thick Mode not available)`);
    return null;
  }

  const pleConnectString = buildConnectString(
    `${PLE_CONFIG.host}:${PLE_CONFIG.port}:${PLE_CONFIG.sid}`
  );

  console.log(`[Oracle-PLE] Attempting PLE lookup: env=${env} app=${app} region=${region}`);
  console.log(`[Oracle-PLE] PLE connection: user=${PLE_CONFIG.user} connectString=${pleConnectString}`);

  let connection: oracledb.Connection | null = null;
  try {
    connection = await oracledb.getConnection({
      user: PLE_CONFIG.user,
      password: PLE_CONFIG.password,
      connectString: pleConnectString,
    });

    const sql = getPleDbUrlQuery(env, app, region);
    console.log(`[Oracle-PLE] PLE SQL: ${sql.replace(/\s+/g, " ").trim()}`);

    const result = await connection.execute(sql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      maxRows: 1,
    });

    const rows = result.rows as Record<string, any>[];
    if (!rows || rows.length === 0) {
      console.warn(`[Oracle-PLE] PLE returned 0 rows for env=${env} app=${app} region=${region}`);
      return null;
    }

    const jdbcUrl = rows[0].A_CONNECTION as string;
    console.log(`[Oracle-PLE] PLE returned JDBC URL: ${jdbcUrl}`);

    const params = parseJdbcToParams(jdbcUrl);
    console.log(`[Oracle-PLE] Parsed: user=${params.user} connectString=${params.connectString}`);
    return params;
  } catch (err) {
    console.warn(`[Oracle-PLE] PLE lookup failed: ${(err as Error).message}`);
    return null;
  } finally {
    if (connection) {
      try { await connection.close(); } catch { /* ignore */ }
    }
  }
}

// ─── Public API ───

/**
 * Resolve Oracle connection parameters for a given environment and application.
 *
 * Resolution order:
 *   1. PLE-DB lookup (if Thick Mode available)
 *   2. Static fallback from oracle-config.ts
 */
export async function getDbConnectionParams(
  env: string,
  app: string,
  region: string = "00"
): Promise<OracleConnectParams> {
  console.log(`[Oracle] Resolving connection: env=${env} app=${app} region=${region}`);

  // Step 1: Try PLE
  const pleResult = await lookupFromPle(env, app, region);
  if (pleResult) {
    console.log(`[Oracle] ✓ Using PLE-DB result for ${app}`);
    return pleResult;
  }

  // Step 2: Static fallback
  console.log(`[Oracle] Using static fallback for env=${env} app=${app} region=${region}`);
  const config: JdbcUrl | null = getFallbackDbConfig(env, app, region);

  if (config) {
    console.log(`[Oracle] ✓ Fallback resolved: user=${config.user} connectString=${config.connectString}`);
    return {
      user: config.user,
      password: config.password,
      connectString: config.connectString,
    };
  }

  const msg = `No DB connection configured for env=${env}, app=${app}, region=${region}`;
  console.error(`[Oracle] ✗ ${msg}`);
  throw new Error(msg);
}

/**
 * Close all connection pools (for graceful shutdown).
 */
export async function closeAllPools(): Promise<void> {
  const keys = Array.from(poolCache.keys());
  for (const key of keys) {
    const pool = poolCache.get(key);
    if (pool) {
      try { await pool.close(0); } catch { /* ignore */ }
    }
    poolCache.delete(key);
  }
}
