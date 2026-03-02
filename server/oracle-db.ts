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

  const slashIdx = raw.indexOf("/");
  const colonParts = raw.split(":");

  if (colonParts.length === 3) {
    // host:port:sid
    const [host, port, sid] = colonParts;
    return `//${host}:${port}/${sid}`;
  }
  if (colonParts.length === 2 && slashIdx > colonParts[0].length) {
    // host:port/service  (slash after second colon)
    return `//${raw}`;
  }
  return raw;
}

/**
 * Get or create a connection pool for the given parameters.
 * Pools are reused across requests for the same user@connectString.
 */
async function getPool(params: OracleConnectParams): Promise<oracledb.Pool> {
  const key = `${params.user}@${params.connectString}`;

  const existing = poolCache.get(key);
  if (existing) {
    try {
      const conn = await existing.getConnection();
      await conn.close();
      return existing;
    } catch {
      try { await existing.close(0); } catch { /* ignore */ }
      poolCache.delete(key);
    }
  }

  const pool = await oracledb.createPool({
    user: params.user,
    password: params.password,
    connectString: buildConnectString(params.connectString),
    poolMin: 0,
    poolMax: 4,
    poolTimeout: 60,
    queueTimeout: 30_000,
  });

  poolCache.set(key, pool);
  return pool;
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
    connection = await pool.getConnection();

    const result = await connection.execute(sql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      maxRows: 1000,
    });

    return (result.rows as Record<string, any>[]) ?? [];
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
  const config: JdbcUrl | null = getFallbackDbConfig(env, app, region);

  if (config) {
    return {
      user: config.user,
      password: config.password,
      connectString: config.connectString,
    };
  }

  throw new Error(
    `No DB connection configured for env=${env}, app=${app}, region=${region}`
  );
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
