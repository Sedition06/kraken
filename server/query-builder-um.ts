/**
 * SQL Query Builder for UM (Unitymedia) Footprint
 *
 * Uses the new data model based on kraken_mamas_tables.xlsx:
 *   - Main view:     NE4.V_VMBKT_UM_ADS_ALM  (most properties – replaces dwh/delphi JOIN)
 *   - Extra table:   NE4.TA_VMBKT_UM_DELPHI   (only for DOCSIS)
 *   - ADS table:     ADS.TA_ADRESSE            (result details, PLZ search)
 *
 * All views/tables are joined via A_ADRESSE_ID.
 */
import { PARALLEL_THREADS, DEFAULT_MAX_ROWS } from "./oracle-config";
import type { VkdSearchParams } from "./query-builder-vkd";

export interface UmSearchParams extends VkdSearchParams {
  ne4Status?: string;
}

/**
 * Build the main MAMAS query for Unitymedia footprint.
 * Uses NE4.V_VMBKT_UM_ADS_ALM as the single main view.
 */
export function buildUmMamasQuery(params: UmSearchParams, addressIdFilter?: number[]): string {
  if (params.oxgFiber) {
    return buildUmFiberQuery(params);
  }

  const maxRows = params.results || DEFAULT_MAX_ROWS;
  const viewConditions: string[] = [];
  const subqueryParts: string[] = [];

  // ── Conditions on NE4.V_VMBKT_UM_ADS_ALM ──

  // Region (OBJ_ORG) – UM regions are single digits: 5, 6, 8
  if (params.regions && params.regions.length > 0) {
    const regionList = params.regions.map(r => `'${r.replace("R0", "")}'`).join(", ");
    viewConditions.push(`OBJ_ORG In (${regionList})`);
  }

  // Workflow KAA (KAA_WORKFLOW)
  if (params.wfKaa) {
    viewConditions.push(`KAA_WORKFLOW = '${params.wfKaa}'`);
  }

  // Workflow KAD (KAD_WORKFLOW)
  if (params.wfKad) {
    viewConditions.push(`KAD_WORKFLOW = '${params.wfKad}'`);
  }

  // Workflow KAI (KAI_WORKFLOW or KAI_WOR_VFW for O2)
  if (params.wfKai) {
    if (params.o2) {
      viewConditions.push(`KAI_WOR_VFW = '${params.wfKai}'`);
    } else {
      viewConditions.push(`KAI_WORKFLOW = '${params.wfKai}'`);
    }
  }

  // SelfInstall (OBJ_SEL_VERFUEGBAR)
  if (params.selfinstall && params.selfinstall !== "*") {
    viewConditions.push(`OBJ_SEL_VERFUEGBAR = '${params.selfinstall}'`);
  }

  // Max WE (OBJ_MAX_WE)
  if (params.maxWeVon) {
    viewConditions.push(`OBJ_MAX_WE >= '${params.maxWeVon}'`);
  }
  if (params.maxWeBis) {
    viewConditions.push(`OBJ_MAX_WE <= '${params.maxWeBis}'`);
  }

  // DS Datenrate (DTR_MAMAS)
  if (params.dsVon) {
    viewConditions.push(`DTR_MAMAS >= '${params.dsVon}'`);
  }
  if (params.dsBis) {
    viewConditions.push(`DTR_MAMAS <= '${params.dsBis}'`);
  }

  // US Datenrate (UTR_MAMAS)
  if (params.usVon) {
    viewConditions.push(`UTR_MAMAS >= '${params.usVon}'`);
  }
  if (params.usBis) {
    viewConditions.push(`UTR_MAMAS <= '${params.usBis}'`);
  }

  // NE4 Status (OBJ_NE4_STATUS)
  if (params.ne4Status) {
    viewConditions.push(`OBJ_NE4_STATUS = '${params.ne4Status}'`);
  }

  // ABK (OBJ_ABK_FLAG)
  if (params.abk && params.abk !== "*") {
    viewConditions.push(`OBJ_ABK_FLAG = '${params.abk}'`);
  }

  // FTTB (OBJ_FIBER_COAX_FLAG)
  if (params.fttb && params.fttb !== "*") {
    viewConditions.push(`OBJ_FIBER_COAX_FLAG = '${params.fttb}'`);
  }

  // Technische Verfügbarkeit KAA (KAA_TV)
  if (params.tvKaa) {
    viewConditions.push(`KAA_TV = '${params.tvKaa}'`);
  }

  // Technische Verfügbarkeit KAD (KAD_TV)
  if (params.tvKad) {
    viewConditions.push(`KAD_TV = '${params.tvKad}'`);
  }

  // Technische Verfügbarkeit KAI (KAI_TV)
  if (params.tvKai) {
    viewConditions.push(`KAI_TV = '${params.tvKai}'`);
  }

  // ÜP-Zustand (OBJ_UEP_ZUSTAND)
  if (params.uepZustand && params.uepZustand !== "*") {
    viewConditions.push(`OBJ_UEP_ZUSTAND = '${params.uepZustand}'`);
  }

  // GS2 Element (OBJ_GS2)
  if (params.gs2Element) {
    viewConditions.push(`OBJ_GS2 = '${params.gs2Element}'`);
  }

  // ── Subqueries against other tables (joined via A_ADRESSE_ID) ──

  // DOCSIS → NE4.TA_VMBKT_UM_DELPHI
  if (params.docsis) {
    subqueryParts.push(
      `A_ADRESSE_ID In (Select A_ADRESSE_ID From NE4.TA_VMBKT_UM_DELPHI Where A_DOCSIS = '${params.docsis}')`
    );
  }

  // BewohnerPlus → TA_REF_UM_GS2
  if (params.bewohnerPlus && params.bpKaa) {
    subqueryParts.push(
      `OBJ_GS2 In (Select A_GS2_CODE_ID From NE4.TA_REF_UM_GS2 Where A_Mieter_Bonus = '${params.bpKaa}')`
    );
  }

  // O2 Überlastung → TA_SEGMENT_KPI_WOCHE
  if (params.o2 && params.wfKai === "S") {
    // The Überlastung filter needs the delphi segment
    subqueryParts.push(
      `A_ADRESSE_ID In (Select A_ADRESSE_ID From NE4.TA_VMBKT_UM_DELPHI Where A_Segment In (Select A_SEGMENT From NE4.TA_SEGMENT_KPI_WOCHE Where A_WS_KPI_PT_DS_US = 'R'))`
    );
  }

  // ── Address ID filter (from PLZ pre-search) ──
  if (addressIdFilter && addressIdFilter.length > 0) {
    viewConditions.push(`A_ADRESSE_ID In (${addressIdFilter.join(", ")})`);
  }

  // ── Assemble final SQL ──
  const allConditions = [...viewConditions, ...subqueryParts];

  const selectPart = `Select /*+ parallel(${PARALLEL_THREADS}) */\n        A_ADRESSE_ID From NE4.V_VMBKT_UM_ADS_ALM\n  Where `;

  if (allConditions.length > 0) {
    return selectPart + allConditions.join(" And ") + ` And Rownum <= ${maxRows}`;
  } else {
    return selectPart + `Rownum <= ${maxRows}`;
  }
}

// ─── Fiber Query ───

function buildUmFiberQuery(params: UmSearchParams): string {
  const conditions: string[] = [];

  if (params.regions && params.regions.length > 0) {
    const regionNums = params.regions.map(r => r.replace("R0", "")).join(", ");
    conditions.push(`A_Org In (${regionNums})`);
  } else {
    conditions.push("A_Org In (5, 6, 8)");
  }

  if (params.fiberStatus) {
    conditions.push(`A_TV_FIBER = ${params.fiberStatus}`);
  }

  const maxRows = params.results || "100";
  return `Select A_Adresse_ID From NE4.TA_VMBKT_FIBER Where ${conditions.join(" And ")} And Rownum <= ${maxRows}`;
}

/**
 * Check if any MAMAS/NE4 filter is active for UM (beyond just PLZ).
 */
export function hasUmMamasFilters(params: UmSearchParams): boolean {
  return !!(
    (params.regions && params.regions.length > 0) ||
    params.wfKaa || params.wfKad || params.wfKai ||
    params.selfinstall ||
    params.maxWeVon || params.maxWeBis ||
    params.dsVon || params.dsBis || params.usVon || params.usBis ||
    params.docsis || params.ne4Status ||
    params.abk || params.fttb ||
    params.tvKaa || params.tvKad || params.tvKai ||
    (params.uepZustand && params.uepZustand !== "*") ||
    params.gs2Element ||
    params.bewohnerPlus || params.o2 || params.oxgFiber
  );
}
