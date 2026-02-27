/**
 * Oracle DB Connection Configuration
 * 
 * This module manages all Oracle database connection strings for the Kraken tool.
 * The PLE database is used as a central registry to look up connection details
 * for MAMAS, ADS, and Wizard databases per environment.
 * 
 * Fallback: If PLE is not reachable, hardcoded JDBC URLs from the original
 * Grails Config.groovy are used.
 */

// ─── PLE Database (central registry) ───
export const PLE_CONFIG = {
  host: process.env.ORACLE_PLE_HOST || "almp-pub1.kabeldeutschland.de",
  port: parseInt(process.env.ORACLE_PLE_PORT || "1525"),
  sid: process.env.ORACLE_PLE_SID || "ALMP",
  user: process.env.ORACLE_PLE_USER || "QC_NGPLE",
  password: process.env.ORACLE_PLE_PASSWORD || "QC_NGPLE.DB2018DB2018",
};

// ─── Environment name mapping (GUI → PLE DB) ───
export function convertEnvToPleEnv(env: string): string {
  switch (env.toUpperCase()) {
    case "GIT": return "GIT";
    case "PNA": return "Prodnah";
    case "3.TEST": return "3. Test";
    case "4.TEST": return "VT4";
    default: return env;
  }
}

// ─── Hardcoded fallback JDBC URLs (from original Config.groovy) ───
export interface JdbcUrl {
  connectString: string;
  user: string;
  password: string;
}

function parseJdbcUrl(jdbc: string): JdbcUrl {
  // Format: jdbc:oracle:thin:user/pass@host:port:sid
  // or:     jdbc:oracle:thin:user/pass@host:port/service
  // or:     jdbc:oracle:thin:@host:port:sid (for PLE)
  const match = jdbc.match(/jdbc:oracle:thin:(?:(.+?)\/(.+?)@)?(.+)/);
  if (!match) throw new Error(`Cannot parse JDBC URL: ${jdbc}`);
  
  const user = match[1] || "";
  const password = match[2] || "";
  const connectPart = match[3]; // host:port:sid or host:port/service
  
  return { connectString: connectPart, user, password };
}

// MAMAS DB URLs per environment
const MAMAS_URLS: Record<string, string> = {
  GIT: "jdbc:oracle:thin:ne4/ne4@mamasgit-pub1.kabeldeutschland.de:1526/MAMASGIT",
  PNA: "jdbc:oracle:thin:ne4/ne4@qlt2062.kabeldeutschland.de:1526:mamaspna",
  "3.TEST": "jdbc:oracle:thin:ne4/ne4@mamas3t-pub1.kabeldeutschland.de:1525/mamas3t",
  "4.TEST": "jdbc:oracle:thin:ne4/YhtpFcUDXTrwjZF9dUhC@mamasvt4-pub1.kabeldeutschland.de:1525/mamasvt4",
};

// ADS DB URLs per environment
const ADS_URLS: Record<string, string> = {
  GIT: "jdbc:oracle:thin:ads_read/ads_read@adsgit-pub1.kabeldeutschland.de:1525:adsgit",
  PNA: "jdbc:oracle:thin:ads_read/ads_read@qlt2062.kabeldeutschland.de:1525/ADSPNA",
  "3.TEST": "jdbc:oracle:thin:ads_read/ads_read@ads3t-pub1.kabeldeutschland.de:1525:ads3t",
  "4.TEST": "jdbc:oracle:thin:ads_read/ads_read@adsvt4-pub1.kabeldeutschland.de:1525:adsvt4",
};

// Wizard DB URLs per environment and region
const WIZARD_URLS: Record<string, Record<string, string>> = {
  GIT: {
    "01": "jdbc:oracle:thin:prod01_read/prod01_read@wizprod1git-pub1.kabeldeutschland.de:1521:wizprod1",
    "02": "jdbc:oracle:thin:prod02_read/prod02_read@wizprod1git-pub1.kabeldeutschland.de:1521:wizprod1",
    "04": "jdbc:oracle:thin:prod04_read/prod04_read@wizprod1git-pub1.kabeldeutschland.de:1521:wizprod1",
    "03": "jdbc:oracle:thin:prod03_read/prod03_read@wizprod2git-pub1.kabeldeutschland.de:1524:wizprod2",
    "07": "jdbc:oracle:thin:prod07_read/prod07_read@wizprod2git-pub1.kabeldeutschland.de:1524:wizprod2",
    "09": "jdbc:oracle:thin:prod09_read/prod09_read@wizprod2git-pub1.kabeldeutschland.de:1524:wizprod2",
  },
  PNA: {
    "01": "jdbc:oracle:thin:prod01_read/prod01_read@wizprod1pna-pub1.kabeldeutschland.de:1521:wizprod1",
    "02": "jdbc:oracle:thin:prod02_read/prod02_read@wizprod1pna-pub1.kabeldeutschland.de:1521:wizprod1",
    "04": "jdbc:oracle:thin:prod04_read/prod04_read@wizprod1pna-pub1.kabeldeutschland.de:1521:wizprod1",
    "03": "jdbc:oracle:thin:prod03_read/prod03_read@wizprod2pna-pub1.kabeldeutschland.de:1524:wizprod2",
    "07": "jdbc:oracle:thin:prod07_read/prod07_read@wizprod2pna-pub1.kabeldeutschland.de:1524:wizprod2",
    "09": "jdbc:oracle:thin:prod09_read/prod09_read@wizprod2pna-pub1.kabeldeutschland.de:1524:wizprod2",
  },
  "3.TEST": {
    "01": "jdbc:oracle:thin:prod01_read/prod01_read@wizprod13t-pub1.kabeldeutschland.de:1521:wizprod1",
    "02": "jdbc:oracle:thin:prod02_read/prod02_read@wizprod13t-pub1.kabeldeutschland.de:1521:wizprod1",
    "04": "jdbc:oracle:thin:prod04_read/prod04_read@wizprod13t-pub1.kabeldeutschland.de:1521:wizprod1",
    "03": "jdbc:oracle:thin:prod03_read/prod03_read@wizprod23t-pub1.kabeldeutschland.de:1524:wizprod2",
    "07": "jdbc:oracle:thin:prod03_read/prod03_read@wizprod23t-pub1.kabeldeutschland.de:1524:wizprod2",
    "09": "jdbc:oracle:thin:prod09_read/prod09_read@wizprod23t-pub1.kabeldeutschland.de:1524:wizprod2",
  },
  "4.TEST": {
    "01": "jdbc:oracle:thin:prod01_read/prod01_read@wizprod1vt4-pub1.kabeldeutschland.de:1521:wizprod1",
    "02": "jdbc:oracle:thin:prod02_read/prod02_read@wizprod1vt4-pub1.kabeldeutschland.de:1521:wizprod1",
    "04": "jdbc:oracle:thin:prod04_read/prod04_read@wizprod1vt4-pub1.kabeldeutschland.de:1521:wizprod1",
    "03": "jdbc:oracle:thin:prod03_read/prod03_read@wizprod2vt4-pub1.kabeldeutschland.de:1524:wizprod2",
    "07": "jdbc:oracle:thin:prod07_read/prod07_read@wizprod2vt4-pub1.kabeldeutschland.de:1524:wizprod2",
    "09": "jdbc:oracle:thin:prod09_read/prod09_read@wizprod2vt4-pub1.kabeldeutschland.de:1524:wizprod2",
  },
};

/**
 * Get a fallback JDBC connection config for a given environment, app and region.
 */
export function getFallbackDbConfig(env: string, app: string, region: string): JdbcUrl | null {
  const envUpper = env.toUpperCase();
  
  switch (app.toUpperCase()) {
    case "MAMAS":
      return MAMAS_URLS[envUpper] ? parseJdbcUrl(MAMAS_URLS[envUpper]) : null;
    case "ADS":
      return ADS_URLS[envUpper] ? parseJdbcUrl(ADS_URLS[envUpper]) : null;
    case "WIZARD": {
      const regionKey = region.replace("R", "").padStart(2, "0");
      const wizEnv = WIZARD_URLS[envUpper];
      if (!wizEnv) return null;
      const url = wizEnv[regionKey];
      return url ? parseJdbcUrl(url) : null;
    }
    default:
      return null;
  }
}

/**
 * SQL to look up a DB connection from the PLE registry.
 */
export function getPleDbUrlQuery(env: string, app: string, region: string): string {
  const pleEnv = convertEnvToPleEnv(env);
  return `
SELECT
    'jdbc:oracle:thin:' || c.a_uid || '/' || c.a_pwd || '@' || c.a_host || ':' || c.a_port || ':' || c.a_sid AS a_connection
FROM
    ta_db_connection c
INNER JOIN ta_environment env ON (env.a_id = c.a_environment_id)
INNER JOIN ta_region reg ON (reg.a_id = c.a_region_id)
INNER JOIN ta_database b ON (b.a_id = c.a_database_id)
INNER JOIN ta_database_type t ON (t.a_id = b.a_type_id)
WHERE
    env.a_name = '${pleEnv}'
AND b.a_name = '${app}'
AND reg.a_name = '${region}'
  `.trim();
}

// SQL parallelism hint threads
export const PARALLEL_THREADS = "30";
export const DEFAULT_MAX_ROWS = "10";
