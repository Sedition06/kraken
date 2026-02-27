/**
 * Oracle Database Connection Service
 * 
 * Provides connection pooling and query execution for Oracle databases.
 * Uses the oracledb thin client (no Oracle Instant Client required).
 */
import oracledb from "oracledb";
import {
  PLE_CONFIG,
  getFallbackDbConfig,
  getPleDbUrlQuery,
  type JdbcUrl,
} from "./oracle-config";

// Use thin mode (no Oracle Instant Client needed)
oracledb.initOracleClient = undefined as any;

// Connection pool cache
const poolCache = new Map<string, oracledb.Pool>();

interface OracleConnectParams {
  user: string;
  password: string;
  connectString: string;
}

/**
 * Parse a connect string that may be in format:
 *   host:port:sid
 *   host:port/service
 */
function buildConnectString(raw: string): string {
  // Already an Easy Connect string or TNS
  if (raw.includes("//") || raw.includes("(")) return raw;
  
  // host:port:sid → //host:port/sid
  const parts = raw.split(":");
  if (parts.length === 3) {
    const [host, port, sid] = parts;
    // Try service name first (works for both SID and service)
    return `//${host}:${port}/${sid}`;
  }
  // host:port/service → //host:port/service
  if (parts.length === 2 && parts[1].includes("/")) {
    return `//${raw}`;
  }
  return raw;
}

/**
 * Get or create a connection pool for the given parameters.
 */
async function getPool(params: OracleConnectParams): Promise<oracledb.Pool> {
  const key = `${params.user}@${params.connectString}`;
  
  let pool = poolCache.get(key);
  if (pool) {
    try {
      // Test if pool is still alive
      const conn = await pool.getConnection();
      await conn.close();
      return pool;
    } catch {
      // Pool is dead, remove and recreate
      try { await pool.close(0); } catch { /* ignore */ }
      poolCache.delete(key);
    }
  }
  
  const connectString = buildConnectString(params.connectString);
  
  pool = await oracledb.createPool({
    user: params.user,
    password: params.password,
    connectString,
    poolMin: 0,
    poolMax: 4,
    poolTimeout: 60,
    queueTimeout: 30000,
  });
  
  poolCache.set(key, pool);
  return pool;
}

/**
 * Execute a SQL query against an Oracle database.
 * Returns rows as plain objects.
 */
export async function executeOracleQuery(
  params: OracleConnectParams,
  sql: string
): Promise<Record<string, any>[]> {
  let connection: oracledb.Connection | null = null;
  
  try {
    const pool = await getPool(params);
    connection = await pool.getConnection();
    
    const result = await connection.execute(sql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      maxRows: 1000,
    });
    
    return (result.rows as Record<string, any>[]) || [];
  } finally {
    if (connection) {
      try { await connection.close(); } catch { /* ignore */ }
    }
  }
}

/**
 * Execute a query using a standalone connection (no pool).
 * Used for one-off queries like PLE lookups.
 */
export async function executeOracleQueryDirect(
  params: OracleConnectParams,
  sql: string
): Promise<Record<string, any>[]> {
  let connection: oracledb.Connection | null = null;
  
  try {
    connection = await oracledb.getConnection({
      user: params.user,
      password: params.password,
      connectString: buildConnectString(params.connectString),
    });
    
    const result = await connection.execute(sql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      maxRows: 1000,
    });
    
    return (result.rows as Record<string, any>[]) || [];
  } finally {
    if (connection) {
      try { await connection.close(); } catch { /* ignore */ }
    }
  }
}

/**
 * Get Oracle connection parameters for a given environment and application.
 * First tries PLE lookup, falls back to hardcoded URLs.
 */
export async function getDbConnectionParams(
  env: string,
  app: string,
  region: string = "00"
): Promise<OracleConnectParams> {
  // Try PLE lookup first
  try {
    const pleParams: OracleConnectParams = {
      user: PLE_CONFIG.user,
      password: PLE_CONFIG.password,
      connectString: `${PLE_CONFIG.host}:${PLE_CONFIG.port}:${PLE_CONFIG.sid}`,
    };
    
    const pleSql = getPleDbUrlQuery(env, app, region);
    const rows = await executeOracleQueryDirect(pleParams, pleSql);
    
    if (rows.length > 0 && rows[0].A_CONNECTION) {
      const jdbc = rows[0].A_CONNECTION as string;
      // Parse: jdbc:oracle:thin:user/pass@host:port:sid
      const match = jdbc.match(/jdbc:oracle:thin:(.+?)\/(.+?)@(.+)/);
      if (match) {
        return {
          user: match[1],
          password: match[2],
          connectString: match[3],
        };
      }
    }
  } catch (err) {
    console.warn(`[Oracle] PLE lookup failed for ${env}/${app}/${region}:`, (err as Error).message);
  }
  
  // Fallback to hardcoded URLs
  const fallback = getFallbackDbConfig(env, app, region);
  if (fallback) {
    return fallback;
  }
  
  throw new Error(`No DB connection available for env=${env}, app=${app}, region=${region}`);
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
