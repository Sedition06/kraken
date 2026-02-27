/**
 * Kraken Search Service
 * 
 * Orchestrates the search flow:
 * 1. Build SQL from form parameters
 * 2. Query MAMAS for A_Adresse_IDs
 * 3. Query ADS for full address details
 * 4. Return results + SQL for debugging
 */
import { getDbConnectionParams, executeOracleQuery } from "./oracle-db";
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

/**
 * Main search function - dispatches to VKD or UM based on footprint.
 */
export async function searchAddresses(params: UmSearchParams): Promise<SearchResponse> {
  const isUnitymedia = params.footprint === "Unitymedia";
  
  try {
    if (isUnitymedia) {
      return await searchUm(params);
    } else {
      return await searchVkd(params);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Kraken] Search error:", message);
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
  
  // Step 1: Check if contract codes are selected → Wizard query first
  if (params.vertragscodes && params.vertragscodes.length > 0) {
    const region = (params.regions && params.regions.length > 0) ? params.regions[0] : "R01";
    const regionNum = region.replace("R", "").padStart(2, "0");
    
    const wizParams = await getDbConnectionParams(env, "WIZARD", regionNum);
    const { indirect, direct } = buildWizardContractQuery(params.vertragscodes);
    
    // Try indirect contract query first
    let wizRows = await executeOracleQuery(wizParams, indirect);
    allSql = indirect;
    
    if (!wizRows || wizRows.length === 0) {
      // Try direct contract query
      wizRows = await executeOracleQuery(wizParams, direct);
      allSql = direct;
    }
    
    if (!wizRows || wizRows.length === 0) {
      return { results: [], sqlQuery: allSql, count: 0 };
    }
    
    // Get address IDs from Wizard result
    addressIds = wizRows.map(r => r.A_ADRESSE_ID as number);
    
    // Now query MAMAS with these address IDs as additional filter
    const mamasParams = await getDbConnectionParams(env, "MAMAS", "00");
    let mamasSql = buildVkdMamasQuery(params);
    
    // Inject address ID filter before Rownum
    const idList = addressIds.join(", ");
    mamasSql = mamasSql.replace("Rownum", `A_ADRESSE_ID In (${idList}) And Rownum`);
    
    const mamasRows = await executeOracleQuery(mamasParams, mamasSql);
    allSql += "\n" + mamasSql;
    
    if (!mamasRows || mamasRows.length === 0) {
      return { results: [], sqlQuery: allSql, count: 0 };
    }
    
    addressIds = mamasRows.map(r => r.A_ADRESSE_ID as number);
  } else {
    // Step 1b: Standard MAMAS query (no contract codes)
    const mamasParams = await getDbConnectionParams(env, "MAMAS", "00");
    const mamasSql = buildVkdMamasQuery(params);
    allSql = mamasSql;
    
    const mamasRows = await executeOracleQuery(mamasParams, mamasSql);
    
    if (!mamasRows || mamasRows.length === 0) {
      return { results: [], sqlQuery: allSql, count: 0 };
    }
    
    addressIds = mamasRows.map(r => r.A_ADRESSE_ID as number);
  }
  
  // Step 2: Query ADS for full address details
  const adsParams = await getDbConnectionParams(env, "ADS", "00");
  const adsSql = buildAdsQuery(addressIds, params.results);
  allSql += "\n" + adsSql;
  
  const adsRows = await executeOracleQuery(adsParams, adsSql);
  
  const results: SearchResult[] = (adsRows || []).map(row => ({
    OBJEKT_ID: String(row.OBJEKT_ID || ""),
    UM_ADRESSE_ID: row.UM_ADRESSE_ID ? String(row.UM_ADRESSE_ID) : undefined,
    ADRESSE: String(row.ADRESSE || ""),
    ONKZ: row.ONKZ ? String(row.ONKZ) : undefined,
  }));
  
  return {
    results,
    sqlQuery: allSql,
    count: results.length,
  };
}

/**
 * UM (Unitymedia) search flow.
 */
async function searchUm(params: UmSearchParams): Promise<SearchResponse> {
  const env = params.environment;
  let allSql = "";
  
  // Step 1: Query MAMAS for address IDs
  const mamasParams = await getDbConnectionParams(env, "MAMAS", "00");
  const mamasSql = buildUmMamasQuery(params);
  allSql = mamasSql;
  
  const mamasRows = await executeOracleQuery(mamasParams, mamasSql);
  
  if (!mamasRows || mamasRows.length === 0) {
    return { results: [], sqlQuery: allSql, count: 0 };
  }
  
  const addressIds = mamasRows.map(r => r.A_ADRESSE_ID as number);
  
  // Step 2: Query ADS for full address details
  const adsParams = await getDbConnectionParams(env, "ADS", "00");
  const adsSql = buildAdsQuery(addressIds, params.results);
  allSql += "\n" + adsSql;
  
  const adsRows = await executeOracleQuery(adsParams, adsSql);
  
  const results: SearchResult[] = (adsRows || []).map(row => ({
    OBJEKT_ID: String(row.OBJEKT_ID || ""),
    UM_ADRESSE_ID: row.UM_ADRESSE_ID ? String(row.UM_ADRESSE_ID) : undefined,
    ADRESSE: String(row.ADRESSE || ""),
    ONKZ: row.ONKZ ? String(row.ONKZ) : undefined,
  }));
  
  return {
    results,
    sqlQuery: allSql,
    count: results.length,
  };
}
