/**
 * Oracle Database Connection Service
 *
 * Provides connection pooling and query execution for Oracle databases.
 * Uses node-oracledb in Thin mode (no Oracle Instant Client required).
 * Supports Oracle 12.1+ (MAMAS 19c, ADS 19c).
 *
 * Connection parameters are resolved directly from the static configuration
 * (oracle-config.ts) — no PLE 11g lookup is performed.
 */
import oracledb from "oracledb";
import { getFallbackDbConfig, type JdbcUrl } from "./oracle-config";

// Connection pool cache keyed by "user@connectString"
const poolCache = new Map<string, oracledb.Pool>();

export interface OracleConnectParams {
  user: string;
  password: string;
  connectString: string;
}

/**
 * Convert a raw connect string from the JDBC URL format to an Easy Connect string.
 *   host:port:sid      →  //host:port/sid
 *   host:port/service  →  //host:port/service
 */
function buildConnectString(raw: string): string {
  if (raw.startsWith("//") || raw.startsWith("(")) return raw;

  const parts = raw.split(":");

  if (parts.length === 3) {
    // host:port:sid  →  //host:port/sid
    const [host, port, sid] = parts;
    return `//${host}:${port}/${sid}`;
  }
  if (parts.length === 2) {
    // host:port/service  →  //host:port/service
    return `//${raw}`;
  }
  return raw;
}

/**
 * Get or create a connection pool for the given parameters.
 * Pools are reused across requests for the same user@connectString.
 */
async function getPool(params: OracleConnectParams): Promise<oracledb.Pool> {
  const connectString = buildConnectString(params.connectString);
  const key = `${params.user}@${connectString}`;

  console.log(`[Oracle] getPool: user=${params.user} rawConnectString="${params.connectString}" → easyConnect="${connectString}"`);

  const existing = poolCache.get(key);
  if (existing) {
    console.log(`[Oracle] Reusing existing pool for ${key}`);
    try {
      const conn = await existing.getConnection();
      await conn.close();
      return existing;
    } catch (err) {
      console.warn(`[Oracle] Existing pool for ${key} is dead (${(err as Error).message}), recreating...`);
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
    console.error(`[Oracle] Failed to create pool for ${key}: ${(err as Error).message}`);
    throw err;
  }
}

/**
 * Execute a SQL query against an Oracle database.
 * Returns rows as plain objects (column names uppercased by oracledb).
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
      maxRows: 1000,
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

/**
 * Resolve Oracle connection parameters for a given environment and application.
 * Uses the static JDBC URL table from oracle-config.ts directly —
 * no PLE (11g) lookup is performed.
 */
export async function getDbConnectionParams(
  env: string,
  app: string,
  region: string = "00"
): Promise<OracleConnectParams> {
  console.log(`[Oracle] Resolving connection params: env=${env} app=${app} region=${region}`);

  const config: JdbcUrl | null = getFallbackDbConfig(env, app, region);

  if (config) {
    console.log(`[Oracle] Resolved: user=${config.user} connectString=${config.connectString}`);
    return {
      user: config.user,
      password: config.password,
      connectString: config.connectString,
    };
  }

  const msg = `No DB connection configured for env=${env}, app=${app}, region=${region}`;
  console.error(`[Oracle] ${msg}`);
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
