/**
 * Kraken Search Service
 *
 * Orchestrates the search flow:
 * 1. Build SQL from form parameters
 * 2. Query MAMAS for A_Adresse_IDs
 * 3. Query ADS for full address details
 * 4. Return results + SQL for debugging
 *
 * Logging: All steps are logged with [KRAKEN] prefix so they are visible
 * in the server console. Sensitive passwords are masked.
 */
import { getDbConnectionParams, executeOracleQuery, type OracleConnectParams } from "./oracle-db";
import { buildVkdMamasQuery, buildAdsQuery, buildWizardContractQuery, type VkdSearchParams } from "./query-builder-vkd";
import { buildUmMamasQuery, type UmSearchParams } from "./query-builder-um";

export interface SearchResult {
  OBJEKT_ID: string;
  UM_ADRESSE_ID?: string;
  ADRESSE: string;
  ONKZ?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  sqlQuery: string;
  count: number;
  error?: string;
}

/** Mask password in connect string for safe logging */
function maskParams(p: OracleConnectParams): string {
  return `user=${p.user} connectString=${p.connectString}`;
}

/** Log a SQL query, truncated for readability */
function logSql(label: string, sql: string): void {
  const preview = sql.replace(/\s+/g, " ").trim().substring(0, 400);
  console.log(`[KRAKEN] ${label} SQL (first 400 chars):\n  ${preview}${sql.length > 400 ? "..." : ""}`);
}

/**
 * Main search function – dispatches to VKD or UM based on footprint.
 */
export async function searchAddresses(params: UmSearchParams): Promise<SearchResponse> {
  const isUnitymedia = params.footprint === "Unitymedia";

  console.log(`\n[KRAKEN] ===== Search started =====`);
  console.log(`[KRAKEN] Params: env=${params.environment} footprint=${params.footprint} regions=${JSON.stringify(params.regions)} results=${params.results}`);

  try {
    const response = isUnitymedia
      ? await searchUm(params)
      : await searchVkd(params);

    console.log(`[KRAKEN] ===== Search finished: ${response.count} result(s) =====\n`);
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error(`[KRAKEN] ===== Search FAILED =====`);
    console.error(`[KRAKEN] Error: ${message}`);
    if (stack) console.error(`[KRAKEN] Stack:\n${stack}`);
    console.error(`[KRAKEN] ===========================\n`);
    return {
      results: [],
      sqlQuery: "",
      count: 0,
      error: `Datenbankfehler: ${message}`,
    };
  }
}

/**
 * VKD (Vodafone Kabel) search flow.
 */
async function searchVkd(params: VkdSearchParams): Promise<SearchResponse> {
  const env = params.environment;
  let allSql = "";
  let addressIds: number[] = [];

  console.log(`[KRAKEN] [VKD] Resolving MAMAS connection for env=${env}...`);
  const mamasParams = await getDbConnectionParams(env, "MAMAS", "00");
  console.log(`[KRAKEN] [VKD] MAMAS connection: ${maskParams(mamasParams)}`);

  // Step 1: Check if contract codes are selected → Wizard query first
  if (params.vertragscodes && params.vertragscodes.length > 0) {
    const region = (params.regions && params.regions.length > 0) ? params.regions[0] : "R01";
    const regionNum = region.replace("R", "").padStart(2, "0");

    console.log(`[KRAKEN] [VKD] Contract codes selected – resolving WIZARD connection for env=${env} region=${regionNum}...`);
    const wizParams = await getDbConnectionParams(env, "WIZARD", regionNum);
    console.log(`[KRAKEN] [VKD] WIZARD connection: ${maskParams(wizParams)}`);

    const { indirect, direct } = buildWizardContractQuery(params.vertragscodes);
    logSql("WIZARD indirect", indirect);

    let wizRows = await executeOracleQuery(wizParams, indirect);
    allSql = indirect;

    if (!wizRows || wizRows.length === 0) {
      console.log(`[KRAKEN] [VKD] WIZARD indirect returned 0 rows – trying direct query...`);
      logSql("WIZARD direct", direct);
      wizRows = await executeOracleQuery(wizParams, direct);
      allSql = direct;
    }

    if (!wizRows || wizRows.length === 0) {
      console.log(`[KRAKEN] [VKD] WIZARD returned 0 rows – no results.`);
      return { results: [], sqlQuery: allSql, count: 0 };
    }

    console.log(`[KRAKEN] [VKD] WIZARD returned ${wizRows.length} address ID(s).`);
    addressIds = wizRows.map(r => r.A_ADRESSE_ID as number);

    // Query MAMAS with address ID filter
    let mamasSql = buildVkdMamasQuery(params);
    const idList = addressIds.join(", ");
    mamasSql = mamasSql.replace("Rownum", `A_ADRESSE_ID In (${idList}) And Rownum`);
    logSql("MAMAS (with Wizard filter)", mamasSql);

    const mamasRows = await executeOracleQuery(mamasParams, mamasSql);
    allSql += "\n" + mamasSql;
    console.log(`[KRAKEN] [VKD] MAMAS (filtered) returned ${mamasRows?.length ?? 0} row(s).`);

    if (!mamasRows || mamasRows.length === 0) {
      return { results: [], sqlQuery: allSql, count: 0 };
    }
    addressIds = mamasRows.map(r => r.A_ADRESSE_ID as number);
  } else {
    // Standard MAMAS query (no contract codes)
    const mamasSql = buildVkdMamasQuery(params);
    allSql = mamasSql;
    logSql("MAMAS", mamasSql);

    const mamasRows = await executeOracleQuery(mamasParams, mamasSql);
    console.log(`[KRAKEN] [VKD] MAMAS returned ${mamasRows?.length ?? 0} row(s).`);

    if (!mamasRows || mamasRows.length === 0) {
      return { results: [], sqlQuery: allSql, count: 0 };
    }
    addressIds = mamasRows.map(r => r.A_ADRESSE_ID as number);
  }

  // Step 2: Query ADS for full address details
  console.log(`[KRAKEN] [VKD] Resolving ADS connection for env=${env}...`);
  const adsParams = await getDbConnectionParams(env, "ADS", "00");
  console.log(`[KRAKEN] [VKD] ADS connection: ${maskParams(adsParams)}`);

  const adsSql = buildAdsQuery(addressIds, params.results);
  allSql += "\n" + adsSql;
  logSql("ADS", adsSql);

  const adsRows = await executeOracleQuery(adsParams, adsSql);
  console.log(`[KRAKEN] [VKD] ADS returned ${adsRows?.length ?? 0} row(s).`);

  const results: SearchResult[] = (adsRows || []).map(row => ({
    OBJEKT_ID: String(row.OBJEKT_ID || ""),
    UM_ADRESSE_ID: row.UM_ADRESSE_ID ? String(row.UM_ADRESSE_ID) : undefined,
    ADRESSE: String(row.ADRESSE || ""),
    ONKZ: row.ONKZ ? String(row.ONKZ) : undefined,
  }));

  return { results, sqlQuery: allSql, count: results.length };
}

/**
 * UM (Unitymedia) search flow.
 */
async function searchUm(params: UmSearchParams): Promise<SearchResponse> {
  const env = params.environment;
  let allSql = "";

  console.log(`[KRAKEN] [UM] Resolving MAMAS connection for env=${env}...`);
  const mamasParams = await getDbConnectionParams(env, "MAMAS", "00");
  console.log(`[KRAKEN] [UM] MAMAS connection: ${maskParams(mamasParams)}`);

  const mamasSql = buildUmMamasQuery(params);
  allSql = mamasSql;
  logSql("MAMAS (UM)", mamasSql);

  const mamasRows = await executeOracleQuery(mamasParams, mamasSql);
  console.log(`[KRAKEN] [UM] MAMAS returned ${mamasRows?.length ?? 0} row(s).`);

  if (!mamasRows || mamasRows.length === 0) {
    return { results: [], sqlQuery: allSql, count: 0 };
  }

  const addressIds = mamasRows.map(r => r.A_ADRESSE_ID as number);

  console.log(`[KRAKEN] [UM] Resolving ADS connection for env=${env}...`);
  const adsParams = await getDbConnectionParams(env, "ADS", "00");
  console.log(`[KRAKEN] [UM] ADS connection: ${maskParams(adsParams)}`);

  const adsSql = buildAdsQuery(addressIds, params.results);
  allSql += "\n" + adsSql;
  logSql("ADS (UM)", adsSql);

  const adsRows = await executeOracleQuery(adsParams, adsSql);
  console.log(`[KRAKEN] [UM] ADS returned ${adsRows?.length ?? 0} row(s).`);

  const results: SearchResult[] = (adsRows || []).map(row => ({
    OBJEKT_ID: String(row.OBJEKT_ID || ""),
    UM_ADRESSE_ID: row.UM_ADRESSE_ID ? String(row.UM_ADRESSE_ID) : undefined,
    ADRESSE: String(row.ADRESSE || ""),
    ONKZ: row.ONKZ ? String(row.ONKZ) : undefined,
  }));

  return { results, sqlQuery: allSql, count: results.length };
}
