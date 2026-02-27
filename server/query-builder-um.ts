/**
 * SQL Query Builder for UM (Unitymedia) Footprint
 * 
 * Ported from the original Grails AdsUyService.groovy.
 * Builds SQL queries against the MAMAS NE4 schema (ta_vmbkt_um_dwh / ta_vmbkt_um_delphi).
 */
import { PARALLEL_THREADS, DEFAULT_MAX_ROWS } from "./oracle-config";
import type { VkdSearchParams } from "./query-builder-vkd";

// Re-export the same param type (UM uses the same interface + ne4Status + gs2Element)
export interface UmSearchParams extends VkdSearchParams {
  ne4Status?: string;
}

/**
 * Build the main MAMAS query for Unitymedia footprint.
 * Uses ta_vmbkt_um_dwh and ta_vmbkt_um_delphi tables.
 */
export function buildUmMamasQuery(params: UmSearchParams): string {
  if (params.oxgFiber) {
    return buildUmFiberQuery(params);
  }
  
  const maxRows = params.results || DEFAULT_MAX_ROWS;
  
  // Base query joining dwh and delphi tables
  let query = `Select /*+ parallel(${PARALLEL_THREADS}) */\ndwh.A_ADRESSE_ID From NE4.ta_vmbkt_um_dwh dwh, NE4.ta_vmbkt_um_delphi delphi\nWhere dwh.A_ADRESSE_ID = delphi.A_ADRESSE_ID`;
  
  // Map GUI parameters to UM-specific column names
  const extra3Parts = buildExtra3(params);
  const serviceSubtypeParts = buildServiceSubtype(params);
  const ne4StatusParts = buildNe4StatusFilter(params);
  const ne4StatusDirect = buildNe4StatusDirect(params);
  const bewohnerPlusPart = buildUmBewohnerPlus(params);
  const o2OverloadPart = buildO2Overload(params);
  const gs2Part = buildGs2Element(params);
  
  query += extra3Parts;
  query += serviceSubtypeParts;
  query += ne4StatusParts;
  query += ne4StatusDirect;
  query += bewohnerPlusPart;
  query += o2OverloadPart;
  query += gs2Part;
  query += ` And Rownum <= ${maxRows}`;
  
  // Clean up
  query = query.replace("Where And", "Where");
  // For Vorvermarktung KAA
  query = query.replace("= 'in", "in").replace("')'", "')");
  
  return query;
}

// ─── Sub-query builders for UM ───

function buildExtra3(params: UmSearchParams): string {
  const conditions: string[] = [];
  
  // Workflow KAA → A_KV_KABEL_TV
  if (params.wfKaa) {
    if (params.wfKaa === "A") {
      conditions.push("A_KV_KABEL_TV = 'N'");
    } else if (params.wfKaa === "B") {
      conditions.push("A_KV_KABEL_TV = 'J'");
    } else if (params.wfKaa === "V") {
      // Vorvermarktung KAA
      conditions.push("A_GEBAEUDE_SEGMENT_2 in ( 'B2', 'B3', 'B4', 'B5', 'B6', 'B7')");
    }
  }
  
  // Workflow KAD → A_KV_DIGITAL_TV
  if (params.wfKad) {
    if (params.wfKad === "A") {
      conditions.push("A_KV_DIGITAL_TV = 'N'");
    } else if (params.wfKad === "B") {
      conditions.push("A_KV_DIGITAL_TV = 'J'");
    }
  }
  
  // Workflow KAI → depends on O2 flag
  if (params.wfKai) {
    if (params.o2) {
      if (params.wfKai !== "S") {
        conditions.push(`A_KAI_WOR_VFW = '${params.wfKai}'`);
      } else {
        // Überlastung: a_kv_internet='J'
        conditions.push("A_KV_INTERNET = 'J'");
      }
    } else {
      if (params.wfKai === "A") {
        conditions.push("A_KV_INTERNET = 'N'");
      } else if (params.wfKai === "B") {
        conditions.push("A_KV_INTERNET = 'J'");
      }
    }
  }
  
  // Max WE
  if (params.maxWeVon) {
    conditions.push(`A_UM_MAX_WE >= '${params.maxWeVon}'`);
  }
  if (params.maxWeBis) {
    conditions.push(`A_UM_MAX_WE <= '${params.maxWeBis}'`);
  }
  
  // TV KAA
  if (params.tvKaa) {
    conditions.push(`A_KAA_TV = '${params.tvKaa}'`);
  }
  
  // TV KAD
  if (params.tvKad) {
    conditions.push(`A_KAD_TV = '${params.tvKad}'`);
  }
  
  // TV KAI: mapping J→TV3, N→KV
  if (params.tvKai) {
    if (params.tvKai === "N") {
      conditions.push("A_KAI_TV = 'KV'");
    } else if (params.tvKai === "J") {
      conditions.push("A_KAI_TV = 'TV3'");
    }
  }
  
  // ÜP-Zustand
  if (params.uepZustand && params.uepZustand !== "*") {
    conditions.push(`A_UEP_ZUSTAND = '${params.uepZustand}'`);
  }
  
  // ABK
  if (params.abk && params.abk !== "*") {
    conditions.push(`A_ABK_FLAG = '${params.abk}'`);
  }
  
  // FTTB / Fiber-Coax
  if (params.fttb && params.fttb !== "*") {
    conditions.push(`A_FIBER_COAX_FLAG = '${params.fttb}'`);
  }
  
  // Selfinstall
  if (params.selfinstall && params.selfinstall !== "*") {
    conditions.push(`A_SELFINSTALL = '${params.selfinstall}'`);
  }
  
  // Regions (UM: R05, R06, R08 → 5, 6, 8)
  if (params.regions && params.regions.length > 0) {
    const regionList = params.regions.map(r => `'${r.replace("R0", "")}'`).join(", ");
    conditions.push(`A_ORG In (${regionList})`);
  }
  
  // PLZ
  if (params.plz && params.plz.length === 5) {
    conditions.push(`A_PLZ = '${params.plz}'`);
  }
  
  if (conditions.length === 0) return "";
  return " And " + conditions.join(" And ");
}

function buildServiceSubtype(params: UmSearchParams): string {
  const conditions: string[] = [];
  
  // DS (Downstream)
  if (params.dsVon) {
    conditions.push(`A_DTR_TECHNISCH >= '${params.dsVon}'`);
  }
  if (params.dsBis) {
    conditions.push(`A_DTR_TECHNISCH <= '${params.dsBis}'`);
  }
  
  // US (Upstream)
  if (params.usVon) {
    conditions.push(`A_UTR_TECHNISCH >= '${params.usVon}'`);
  }
  if (params.usBis) {
    conditions.push(`A_UTR_TECHNISCH <= '${params.usBis}'`);
  }
  
  // DOCSIS
  if (params.docsis) {
    conditions.push(`A_DOCSIS = '${params.docsis}'`);
  }
  
  if (conditions.length === 0) return "";
  return " And " + conditions.join(" And ");
}

function buildNe4StatusFilter(params: UmSearchParams): string {
  // SEL Verfügbar filter via TA_REF_UM_NE4_STATUS
  // This is currently not directly exposed in the GUI, but the original code supports it
  return "";
}

function buildNe4StatusDirect(params: UmSearchParams): string {
  if (!params.ne4Status) return "";
  return ` AND A_NE4_STATUS = '${params.ne4Status}'`;
}

function buildUmBewohnerPlus(params: UmSearchParams): string {
  if (!params.bewohnerPlus || !params.bpKaa) return "";
  return ` And A_GEBAEUDE_SEGMENT_2 In (Select A_GS2_CODE_ID From NE4.TA_REF_UM_GS2 Where A_Mieter_Bonus = '${params.bpKaa}')`;
}

function buildO2Overload(params: UmSearchParams): string {
  if (!params.o2 || !params.wfKai || params.wfKai !== "S") return "";
  return " And delphi.A_Segment in (select a_segment from NE4.TA_SEGMENT_KPI_WOCHE where A_WS_KPI_PT_DS_US = 'R')";
}

function buildGs2Element(params: UmSearchParams): string {
  if (!params.gs2Element) return "";
  return ` And dwh.a_gebaeude_segment_2 = '${params.gs2Element}'`;
}

function buildUmFiberQuery(params: UmSearchParams): string {
  const conditions: string[] = [];
  
  // Region filter for Fiber (UM regions: 5, 6, 8)
  if (params.regions && params.regions.length > 0) {
    const regionNums = params.regions.map(r => r.replace("R0", "")).join(", ");
    conditions.push(`A_Org In (${regionNums})`);
  } else {
    conditions.push("A_Org In (5, 6, 8)");
  }
  
  // Fiber status
  if (params.fiberStatus) {
    conditions.push(`A_TV_FIBER = ${params.fiberStatus}`);
  }
  
  const maxRows = params.results || "100";
  const whereClause = conditions.join(" And ");
  
  return `Select A_Adresse_ID From NE4.TA_VMBKT_FIBER Where ${whereClause} And Rownum <= ${maxRows}`;
}
