/**
 * Kraken Search Service
 *
 * Orchestrates the search flow:
 *
 * VKD flow:
 *   1. If PLZ set → query ADS.TA_ADRESSE with A_V_PLZ_SUCH (indexed!) for IDs
 *   2. Build MAMAS query against NE4.V_VMBKT_ADS_ALM (+ optional subqueries)
 *      - If PLZ IDs exist → pass them as filter to the MAMAS query
 *      - Contract data now comes from NE4.V_WIZ_CUSTOMER_CONTRACTS (no Wizard-DB!)
 *   3. Query ADS for full address details
 *
 * UM flow:
 *   1. If PLZ set → query ADS.TA_ADRESSE with A_V_PLZ_SUCH (indexed!) for IDs
 *   2. Build MAMAS query against NE4.V_VMBKT_UM_ADS_ALM (+ optional subqueries)
 *   3. Query ADS for full address details
 *
 * PLZ-only flow (no other MAMAS filters):
 *   → Query ADS directly for results (no MAMAS round-trip needed)
 *
 * Logging: All steps are logged with [KRAKEN] prefix.
 */
import { getDbConnectionParams, executeOracleQuery, type OracleConnectParams } from "./oracle-db";
import { buildVkdMamasQuery, buildAdsQuery, buildPlzSearchQuery, hasMamasFilters, type VkdSearchParams } from "./query-builder-vkd";
import { buildUmMamasQuery, hasUmMamasFilters, type UmSearchParams } from "./query-builder-um";

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
  const oneLine = sql.replace(/\s+/g, " ").trim();
  const preview = oneLine.substring(0, 500);
  console.log(`[KRAKEN] ${label} SQL (${sql.length} chars):\n  ${preview}${sql.length > 500 ? "..." : ""}`);
}

/**
 * Main search function – dispatches to VKD or UM based on footprint.
 */
export async function searchAddresses(params: UmSearchParams): Promise<SearchResponse> {
  const isUnitymedia = params.footprint === "Unitymedia";

  console.log(`\n[KRAKEN] ===== Search started =====`);
  console.log(`[KRAKEN] Params: env=${params.environment} footprint=${params.footprint}`);
  console.log(`[KRAKEN]   regions=${JSON.stringify(params.regions)} plz=${params.plz || "(none)"} results=${params.results}`);
  console.log(`[KRAKEN]   wfKaa=${params.wfKaa || "-"} wfKad=${params.wfKad || "-"} wfKai=${params.wfKai || "-"} o2=${params.o2 || false}`);
  console.log(`[KRAKEN]   selfinstall=${params.selfinstall || "-"} docsis=${params.docsis || "-"} abk=${params.abk || "-"} fttb=${params.fttb || "-"}`);
  console.log(`[KRAKEN]   tvKaa=${params.tvKaa || "-"} tvKad=${params.tvKad || "-"} tvKai=${params.tvKai || "-"} uepZustand=${params.uepZustand || "-"}`);
  console.log(`[KRAKEN]   vertragsnr=${params.vertragsnummer || "-"} kundennr=${params.kundennummer || "-"} vertragscodes=${JSON.stringify(params.vertragscodes) || "-"}`);
  console.log(`[KRAKEN]   ccb1=${params.gestattungsvertrag || "-"} ccb2=${params.anschlussvertrag || "-"} salessegment=${params.salessegment || "-"}`);
  if (isUnitymedia) {
    console.log(`[KRAKEN]   ne4Status=${(params as UmSearchParams).ne4Status || "-"} gs2Element=${params.gs2Element || "-"}`);
  }

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

// ─── VKD Search ───

async function searchVkd(params: VkdSearchParams): Promise<SearchResponse> {
  const env = params.environment;
  let allSql = "";
  let plzAddressIds: number[] | undefined;

  // ── Step 1: PLZ pre-search (if PLZ is set) ──
  if (params.plz && params.plz.length === 5) {
    console.log(`[KRAKEN] [VKD] PLZ search: ${params.plz}`);

    // Check if we have any MAMAS filters beyond PLZ
    const needsMamas = hasMamasFilters(params);
    console.log(`[KRAKEN] [VKD] Has MAMAS filters beyond PLZ: ${needsMamas}`);

    if (!needsMamas) {
      // PLZ only → query ADS directly for results (no MAMAS round-trip)
      console.log(`[KRAKEN] [VKD] PLZ-only search (no MAMAS filters) → querying ADS directly`);
      const adsParams = await getDbConnectionParams(env, "ADS", "00");
      console.log(`[KRAKEN] [VKD] ADS connection: ${maskParams(adsParams)}`);

      const plzSql = buildPlzSearchQuery(params.plz, false, params.results || "100");
      allSql = plzSql;
      logSql("ADS PLZ-only", plzSql);

      const adsRows = await executeOracleQuery(adsParams, plzSql);
      console.log(`[KRAKEN] [VKD] ADS PLZ-only returned ${adsRows?.length ?? 0} row(s).`);

      return {
        results: mapAdsRows(adsRows),
        sqlQuery: allSql,
        count: adsRows?.length ?? 0,
      };
    }

    // PLZ + MAMAS filters → get IDs from ADS first, then filter in MAMAS
    console.log(`[KRAKEN] [VKD] PLZ + MAMAS filters → pre-fetching IDs from ADS`);
    const adsParams = await getDbConnectionParams(env, "ADS", "00");
    console.log(`[KRAKEN] [VKD] ADS connection: ${maskParams(adsParams)}`);

    const plzIdSql = buildPlzSearchQuery(params.plz, true, "10000");
    allSql = plzIdSql;
    logSql("ADS PLZ ID-fetch", plzIdSql);

    const plzRows = await executeOracleQuery(adsParams, plzIdSql);
    console.log(`[KRAKEN] [VKD] ADS PLZ returned ${plzRows?.length ?? 0} address ID(s).`);

    if (!plzRows || plzRows.length === 0) {
      return { results: [], sqlQuery: allSql, count: 0 };
    }

    plzAddressIds = plzRows.map(r => r.A_ADRESSE_ID as number);
    console.log(`[KRAKEN] [VKD] PLZ pre-filter: ${plzAddressIds.length} IDs to pass to MAMAS (using ADS.A_ADRESSE_ID)`);
  }

  // ── Step 2: MAMAS query against NE4.V_VMBKT_ADS_ALM ──
  console.log(`[KRAKEN] [VKD] Resolving MAMAS connection for env=${env}...`);
  const mamasParams = await getDbConnectionParams(env, "MAMAS", "00");
  console.log(`[KRAKEN] [VKD] MAMAS connection: ${maskParams(mamasParams)}`);

  const mamasSql = buildVkdMamasQuery(params, plzAddressIds);
  allSql += (allSql ? "\n" : "") + mamasSql;
  logSql("MAMAS (V_VMBKT_ADS_ALM)", mamasSql);

  const mamasRows = await executeOracleQuery(mamasParams, mamasSql);
  console.log(`[KRAKEN] [VKD] MAMAS returned ${mamasRows?.length ?? 0} row(s).`);

  if (!mamasRows || mamasRows.length === 0) {
    return { results: [], sqlQuery: allSql, count: 0 };
  }

  const addressIds = mamasRows.map(r => r.OBJ_ADRESSE_ID as number);

  // ── Step 3: ADS query for full address details ──
  console.log(`[KRAKEN] [VKD] Resolving ADS connection for env=${env}...`);
  const adsParams = await getDbConnectionParams(env, "ADS", "00");
  console.log(`[KRAKEN] [VKD] ADS connection: ${maskParams(adsParams)}`);

  const adsSql = buildAdsQuery(addressIds, params.results);
  allSql += "\n" + adsSql;
  logSql("ADS", adsSql);

  const adsRows = await executeOracleQuery(adsParams, adsSql);
  console.log(`[KRAKEN] [VKD] ADS returned ${adsRows?.length ?? 0} row(s).`);

  return {
    results: mapAdsRows(adsRows),
    sqlQuery: allSql,
    count: adsRows?.length ?? 0,
  };
}

// ─── UM Search ───

async function searchUm(params: UmSearchParams): Promise<SearchResponse> {
  const env = params.environment;
  let allSql = "";
  let plzAddressIds: number[] | undefined;

  // ── Step 1: PLZ pre-search (if PLZ is set) ──
  if (params.plz && params.plz.length === 5) {
    console.log(`[KRAKEN] [UM] PLZ search: ${params.plz}`);

    const needsMamas = hasUmMamasFilters(params);
    console.log(`[KRAKEN] [UM] Has MAMAS filters beyond PLZ: ${needsMamas}`);

    if (!needsMamas) {
      // PLZ only → query ADS directly
      console.log(`[KRAKEN] [UM] PLZ-only search → querying ADS directly`);
      const adsParams = await getDbConnectionParams(env, "ADS", "00");
      console.log(`[KRAKEN] [UM] ADS connection: ${maskParams(adsParams)}`);

      const plzSql = buildPlzSearchQuery(params.plz, false, params.results || "100");
      allSql = plzSql;
      logSql("ADS PLZ-only (UM)", plzSql);

      const adsRows = await executeOracleQuery(adsParams, plzSql);
      console.log(`[KRAKEN] [UM] ADS PLZ-only returned ${adsRows?.length ?? 0} row(s).`);

      return {
        results: mapAdsRows(adsRows),
        sqlQuery: allSql,
        count: adsRows?.length ?? 0,
      };
    }

    // PLZ + MAMAS filters → get IDs from ADS first
    console.log(`[KRAKEN] [UM] PLZ + MAMAS filters → pre-fetching IDs from ADS`);
    const adsParams = await getDbConnectionParams(env, "ADS", "00");
    console.log(`[KRAKEN] [UM] ADS connection: ${maskParams(adsParams)}`);

    const plzIdSql = buildPlzSearchQuery(params.plz, true, "10000");
    allSql = plzIdSql;
    logSql("ADS PLZ ID-fetch (UM)", plzIdSql);

    const plzRows = await executeOracleQuery(adsParams, plzIdSql);
    console.log(`[KRAKEN] [UM] ADS PLZ returned ${plzRows?.length ?? 0} address ID(s).`);

    if (!plzRows || plzRows.length === 0) {
      return { results: [], sqlQuery: allSql, count: 0 };
    }

    plzAddressIds = plzRows.map(r => r.A_ADRESSE_ID as number);
    console.log(`[KRAKEN] [UM] PLZ pre-filter: ${plzAddressIds.length} IDs to pass to MAMAS (using ADS.A_ADRESSE_ID)`);
  }

  // ── Step 2: MAMAS query against NE4.V_VMBKT_UM_ADS_ALM ──
  console.log(`[KRAKEN] [UM] Resolving MAMAS connection for env=${env}...`);
  const mamasParams = await getDbConnectionParams(env, "MAMAS", "00");
  console.log(`[KRAKEN] [UM] MAMAS connection: ${maskParams(mamasParams)}`);

  const mamasSql = buildUmMamasQuery(params, plzAddressIds);
  allSql += (allSql ? "\n" : "") + mamasSql;
  logSql("MAMAS (V_VMBKT_UM_ADS_ALM)", mamasSql);

  const mamasRows = await executeOracleQuery(mamasParams, mamasSql);
  console.log(`[KRAKEN] [UM] MAMAS returned ${mamasRows?.length ?? 0} row(s).`);

  if (!mamasRows || mamasRows.length === 0) {
    return { results: [], sqlQuery: allSql, count: 0 };
  }

  const addressIds = mamasRows.map(r => r.OBJ_ADRESSE_ID as number);

  // ── Step 3: ADS query for full address details ──
  console.log(`[KRAKEN] [UM] Resolving ADS connection for env=${env}...`);
  const adsParams = await getDbConnectionParams(env, "ADS", "00");
  console.log(`[KRAKEN] [UM] ADS connection: ${maskParams(adsParams)}`);

  const adsSql = buildAdsQuery(addressIds, params.results);
  allSql += "\n" + adsSql;
  logSql("ADS (UM)", adsSql);

  const adsRows = await executeOracleQuery(adsParams, adsSql);
  console.log(`[KRAKEN] [UM] ADS returned ${adsRows?.length ?? 0} row(s).`);

  return {
    results: mapAdsRows(adsRows),
    sqlQuery: allSql,
    count: adsRows?.length ?? 0,
  };
}

// ─── Helpers ───

function mapAdsRows(rows: Record<string, any>[] | undefined): SearchResult[] {
  return (rows || []).map(row => ({
    OBJEKT_ID: String(row.OBJEKT_ID || ""),
    UM_ADRESSE_ID: row.UM_ADRESSE_ID ? String(row.UM_ADRESSE_ID) : undefined,
    ADRESSE: String(row.ADRESSE || ""),
    ONKZ: row.ONKZ ? String(row.ONKZ) : undefined,
  }));
}
