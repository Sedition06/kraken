/**
 * SQL Query Builder for VKD (Vodafone Kabel) Footprint
 *
 * Uses the new data model based on kraken_mamas_tables.xlsx:
 *   - Main view:       NE4.V_VMBKT_ADS_ALM  (most properties)
 *   - Extra table:     NE4.TA_VMBKT_OBJEKT   (DOCSIS, ABK, FTTB)
 *   - Contract view:   NE4.V_WIZ_CUSTOMER_CONTRACTS (replaces direct Wizard-DB access)
 *   - Vermarktbarkeit: NE4.V_VERMARKTBARKEIT_OBJEKT (CCB1, CCB2)
 *   - ADS table:       ADS.TA_ADRESSE (result details, PLZ search)
 *
 * All views/tables are joined via A_ADRESSE_ID.
 */
import { PARALLEL_THREADS, DEFAULT_MAX_ROWS } from "./oracle-config";

export interface VkdSearchParams {
  environment: string;
  footprint: string;
  results?: string;
  regions?: string[];
  plz?: string;
  o2?: boolean;
  bewohnerPlus?: boolean;
  oxgFiber?: boolean;
  // Workflow
  wfKaa?: string;
  wfKad?: string;
  wfKai?: string;
  // Technische Parameter
  selfinstall?: string;
  direktVersorgt?: string;
  maxWeVon?: string;
  maxWeBis?: string;
  dsVon?: string;
  dsBis?: string;
  usVon?: string;
  usBis?: string;
  docsis?: string;
  abk?: string;
  fttb?: string;
  // Technische Verfügbarkeit
  tvKaa?: string;
  tvKad?: string;
  tvKai?: string;
  uepZustand?: string;
  // Fiber
  fiberStatus?: string;
  // Vertragssituation
  vertragsnummer?: string;
  kundennummer?: string;
  gestattungsvertrag?: string;
  anschlussvertrag?: string;
  salessegment?: string;
  vertragscodes?: string[];
  gs2Element?: string;
  // BewohnerPlus
  bpKaa?: string;
  bpKad?: string;
  bpKai?: string;
}

// ─── Main View Query ───

/**
 * Build the main MAMAS query for VKD footprint.
 * Returns SQL to get A_ADRESSE_ID values from NE4.V_VMBKT_ADS_ALM.
 *
 * Note: When PLZ is set, the address IDs come from ADS first (see kraken-service.ts).
 * This function only builds the MAMAS/NE4 part.
 */
export function buildVkdMamasQuery(params: VkdSearchParams, addressIdFilter?: number[]): string {
  if (params.oxgFiber) {
    return buildFiberQuery(params);
  }

  const maxRows = params.results || DEFAULT_MAX_ROWS;
  const viewConditions: string[] = [];
  const subqueryParts: string[] = [];

  // ── Conditions on NE4.V_VMBKT_ADS_ALM ──

  // Region (OBJ_REGION)
  if (params.regions && params.regions.length > 0) {
    const regionList = params.regions.map(r => `'${r}'`).join(", ");
    viewConditions.push(`OBJ_REGION In (${regionList})`);
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
  // Groovy VKD logic: O2 checkbox replaces a_workflow with a_wor_vfw
  if (params.wfKai) {
    if (params.o2) {
      viewConditions.push(`KAI_WOR_VFW = '${params.wfKai}'`);
    } else {
      viewConditions.push(`KAI_WORKFLOW = '${params.wfKai}'`);
    }
  }

  // SelfInstall (SEL_TV)
  if (params.selfinstall && params.selfinstall !== "*") {
    viewConditions.push(`SEL_TV = '${params.selfinstall}'`);
  }

  // Direkt Versorgt (OBJ_VERSORGUNGSART)
  // Ja → = 'D', Nein → <> 'D'
  if (params.direktVersorgt === "J") {
    viewConditions.push(`OBJ_VERSORGUNGSART = 'D'`);
  } else if (params.direktVersorgt === "N") {
    viewConditions.push(`OBJ_VERSORGUNGSART <> 'D'`);
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

  // Salessegment (VWZ_VERTRIEBSSEGMENT)
  if (params.salessegment) {
    viewConditions.push(`VWZ_VERTRIEBSSEGMENT = '${params.salessegment}'`);
  }

  // ── Subqueries against other tables (joined via A_ADRESSE_ID) ──

  // O2-Checkbox → NE4.TA_VMBKT_OBJEKT WHERE A_WSF = 'J'
  // Groovy: params.ta_vmbkt_objekt.a_wsf = 'J' → queryTaVmbktObjekt adds this as a condition
  if (params.o2) {
    subqueryParts.push(
      `OBJ_ADRESSE_ID In (Select A_ADRESSE_ID From NE4.TA_VMBKT_OBJEKT Where A_WSF = 'J')`
    );
  }

  // DOCSIS, ABK, FTTB → NE4.TA_VMBKT_OBJEKT
  const objektConditions: string[] = [];
  if (params.docsis) {
    objektConditions.push(`A_DOCSIS = '${params.docsis}'`);
  }
  if (params.abk && params.abk !== "*") {
    objektConditions.push(`A_ABK_FLAG = '${params.abk}'`);
  }
  if (params.fttb && params.fttb !== "*") {
    objektConditions.push(`A_FIBER_COAX_FLAG = '${params.fttb}'`);
  }
  if (objektConditions.length > 0) {
    subqueryParts.push(
      `OBJ_ADRESSE_ID In (Select A_ADRESSE_ID From NE4.TA_VMBKT_OBJEKT Where ${objektConditions.join(" And ")})`
    );
  }

  // Vertragsnummer, Kundennummer → NE4.V_WIZ_CUSTOMER_CONTRACTS
  const contractConditions: string[] = [];
  if (params.vertragsnummer) {
    contractConditions.push(`CONTRACT_NUMBER = '${params.vertragsnummer}'`);
  }
  if (params.kundennummer) {
    contractConditions.push(`ACCOUNT_NUMBER = '${params.kundennummer}'`);
  }
  if (contractConditions.length > 0) {
    subqueryParts.push(
      `OBJ_ADRESSE_ID In (Select A_ADRESSE_ID From NE4.V_WIZ_CUSTOMER_CONTRACTS Where ${contractConditions.join(" And ")})`
    );
  }

  // Vertragscodes → NE4.V_WIZ_CUSTOMER_CONTRACTS (multiple codes, CONTRACT_STATUS = 'AK')
  if (params.vertragscodes && params.vertragscodes.length > 0) {
    const contractList = params.vertragscodes.map(c => `'${c}'`).join(", ");
    subqueryParts.push(
      `OBJ_ADRESSE_ID In (Select A_ADRESSE_ID From NE4.V_WIZ_CUSTOMER_CONTRACTS Where CONTRACT_CODE In (${contractList}) And CONTRACT_STATUS = 'AK')`
    );
  }

  // Gestattungsvertrag (CCB1) → NE4.V_VERMARKTBARKEIT_OBJEKT
  if (params.gestattungsvertrag && params.gestattungsvertrag !== "0") {
    subqueryParts.push(
      `OBJ_ADRESSE_ID In (Select A_ADRESSE_ID From NE4.V_VERMARKTBARKEIT_OBJEKT Where A_CCB1 = '${params.gestattungsvertrag}')`
    );
  }

  // Anschlussvertrag (CCB2) → NE4.V_VERMARKTBARKEIT_OBJEKT
  if (params.anschlussvertrag && params.anschlussvertrag !== "0") {
    subqueryParts.push(
      `OBJ_ADRESSE_ID In (Select A_ADRESSE_ID From NE4.V_VERMARKTBARKEIT_OBJEKT Where A_CCB2 = '${params.anschlussvertrag}')`
    );
  }

  // BewohnerPlus KAI → still uses the old TA_VMBKT_KAI table (not in the new view)
  if (params.bewohnerPlus && params.bpKai) {
    const bpVal = `'${params.bpKai}'`;
    if (params.bpKai === "N") {
      subqueryParts.push(
        `OBJ_ADRESSE_ID In (Select A_ADRESSE_ID From NE4.TA_VMBKT_KAI Where (A_MBO_FLAG_KAN_GRP IN (SELECT A_KANAL_GRUPPE_ID FROM NE4.TA_KANAL_GRUPPE WHERE A_PUB = ${bpVal}) Or A_MBO_FLAG_KAN_GRP IS NULL))`
      );
    } else {
      subqueryParts.push(
        `OBJ_ADRESSE_ID In (Select A_ADRESSE_ID From NE4.TA_VMBKT_KAI Where A_MBO_FLAG_KAN_GRP IN (SELECT A_KANAL_GRUPPE_ID FROM NE4.TA_KANAL_GRUPPE WHERE A_PUB = ${bpVal}) OR A_ADRESSE_ID In (SELECT A_ADRESSE_ID FROM NE4.TA_VMBKT_OBJEKT WHERE A_CCB2 in ('A','C','F','L','E','D')))`
      );
    }
  }

  // BewohnerPlus KAA → TA_VMBKT_KAA_KAD
  if (params.bewohnerPlus && params.bpKaa) {
    const bpVal = `'${params.bpKaa}'`;
    if (params.bpKaa === "N") {
      subqueryParts.push(
        `OBJ_ADRESSE_ID In (Select A_ADRESSE_ID From NE4.TA_VMBKT_KAA_KAD Where (A_MBO_FLAG_KAN_GRP IN (SELECT A_KANAL_GRUPPE_ID FROM NE4.TA_KANAL_GRUPPE WHERE A_PUB = ${bpVal}) And A_DIENSTKATEGORIE = 'KAA') Or (A_MBO_FLAG_KAN_GRP IS NULL And A_DIENSTKATEGORIE = 'KAA'))`
      );
    } else {
      subqueryParts.push(
        `OBJ_ADRESSE_ID In (Select A_ADRESSE_ID From NE4.TA_VMBKT_KAA_KAD Where (A_MBO_FLAG_KAN_GRP IN (SELECT A_KANAL_GRUPPE_ID FROM NE4.TA_KANAL_GRUPPE WHERE A_PUB = ${bpVal}) And A_DIENSTKATEGORIE = 'KAA') OR A_ADRESSE_ID In (SELECT A_ADRESSE_ID FROM NE4.TA_VMBKT_OBJEKT WHERE A_CCB2 in ('A','C','F','L','E','D')))`
      );
    }
  }

  // BewohnerPlus KAD → TA_VMBKT_KAA_KAD
  if (params.bewohnerPlus && params.bpKad) {
    const bpVal = `'${params.bpKad}'`;
    if (params.bpKad === "N") {
      subqueryParts.push(
        `OBJ_ADRESSE_ID In (Select A_ADRESSE_ID From NE4.TA_VMBKT_KAA_KAD Where (A_MBO_FLAG_KAN_GRP IN (SELECT A_KANAL_GRUPPE_ID FROM NE4.TA_KANAL_GRUPPE WHERE A_PUB = ${bpVal}) And A_DIENSTKATEGORIE = 'KAD') Or (A_MBO_FLAG_KAN_GRP IS NULL And A_DIENSTKATEGORIE = 'KAD'))`
      );
    } else {
      subqueryParts.push(
        `OBJ_ADRESSE_ID In (Select A_ADRESSE_ID From NE4.TA_VMBKT_KAA_KAD Where (A_MBO_FLAG_KAN_GRP IN (SELECT A_KANAL_GRUPPE_ID FROM NE4.TA_KANAL_GRUPPE WHERE A_PUB = ${bpVal}) And A_DIENSTKATEGORIE = 'KAD') OR A_ADRESSE_ID In (SELECT A_ADRESSE_ID FROM NE4.TA_VMBKT_OBJEKT WHERE A_CCB2 in ('A','C','F','L','E','D')))`
      );
    }
  }

  // ── Address ID filter (from PLZ pre-search or Wizard) ──
  if (addressIdFilter && addressIdFilter.length > 0) {
    viewConditions.push(`OBJ_ADRESSE_ID In (${addressIdFilter.join(", ")})`);
  }

  // ── Assemble final SQL ──
  const allConditions = [...viewConditions, ...subqueryParts];

  const selectPart = `Select /*+ parallel(${PARALLEL_THREADS}) */\n        OBJ_ADRESSE_ID From NE4.V_VMBKT_ADS_ALM\n  Where `;

  if (allConditions.length > 0) {
    return selectPart + allConditions.join(" And ") + ` And Rownum <= ${maxRows}`;
  } else {
    return selectPart + `Rownum <= ${maxRows}`;
  }
}

// ─── ADS Query ───

/**
 * Build the ADS query to get full address details from A_Adresse_IDs.
 */
export function buildAdsQuery(addressIds: number[], maxRows?: string): string {
  if (!addressIds || addressIds.length === 0) return "";

  const rows = maxRows || DEFAULT_MAX_ROWS;
  const idList = addressIds.join(", ");

  return `Select /*+ parallel(${PARALLEL_THREADS}) */
        A_Adresse_ID As OBJEKT_ID, A_UM_GEBAEUDE_ID As UM_ADRESSE_ID, A_PLZ || ' ' || A_ORTSNAME || ', ' || A_STRNAME || ' ' || A_HAUSNR || ' ' || A_HAUSNR_ZUS AS ADRESSE, A_REF_TELEFONIE_ONKZ AS ONKZ
  From ADS.TA_ADRESSE
  Where A_ADRESSE_ID In (${idList}) And Rownum <= ${rows}`;
}

// ─── PLZ Search (ADS) ───

/**
 * Build the ADS PLZ search query.
 * Uses the indexed column A_V_PLZ_SUCH (not A_PLZ!) to avoid full table scans.
 *
 * @param plz - 5-digit German postal code
 * @param onlyIds - if true, returns only A_Adresse_ID (for further MAMAS filtering)
 * @param maxRows - max rows to return
 */
export function buildPlzSearchQuery(plz: string, onlyIds: boolean, maxRows: string): string {
  if (onlyIds) {
    return `Select A_Adresse_ID From ADS.TA_ADRESSE Where A_SERVICEADRESSE = 'J' And A_V_PLZ_SUCH = '${plz}' And Rownum <= ${maxRows}`;
  }

  // Full result query (when no further MAMAS filters are needed)
  return `Select A_Adresse_ID As OBJEKT_ID, A_UM_GEBAEUDE_ID As UM_ADRESSE_ID, A_PLZ || ' ' || A_ORTSNAME || ', ' || A_STRNAME || ' ' || A_HAUSNR || ' ' || A_HAUSNR_ZUS AS ADRESSE, A_REF_TELEFONIE_ONKZ AS ONKZ
  From ADS.TA_ADRESSE
  Where A_SERVICEADRESSE = 'J' And A_V_PLZ_SUCH = '${plz}' And Rownum <= ${maxRows}`;
}

// ─── Fiber Query ───

function buildFiberQuery(params: VkdSearchParams): string {
  const conditions: string[] = [];

  if (params.regions && params.regions.length > 0) {
    const regionNums = params.regions.map(r => r.replace("R0", "")).join(", ");
    conditions.push(`A_Org In (${regionNums})`);
  } else {
    conditions.push("A_Org In (1, 2, 3, 4, 7, 9)");
  }

  if (params.fiberStatus) {
    conditions.push(`A_TV_FIBER = ${params.fiberStatus}`);
  }

  const maxRows = params.results || "100";
  return `Select A_Adresse_ID As OBJ_ADRESSE_ID From NE4.TA_VMBKT_FIBER Where ${conditions.join(" And ")} And Rownum <= ${maxRows}`;
}

/**
 * Check if any MAMAS/NE4 filter is active (beyond just PLZ).
 * Used to decide if PLZ results need further MAMAS filtering.
 */
export function hasMamasFilters(params: VkdSearchParams): boolean {
  return !!(
    (params.regions && params.regions.length > 0) ||
    params.wfKaa || params.wfKad || params.wfKai ||
    params.selfinstall || params.direktVersorgt ||
    params.maxWeVon || params.maxWeBis ||
    params.dsVon || params.dsBis || params.usVon || params.usBis ||
    params.docsis || params.abk || params.fttb ||
    params.tvKaa || params.tvKad || params.tvKai ||
    (params.uepZustand && params.uepZustand !== "*") ||
    params.salessegment ||
    params.vertragsnummer || params.kundennummer ||
    (params.vertragscodes && params.vertragscodes.length > 0) ||
    (params.gestattungsvertrag && params.gestattungsvertrag !== "0") ||
    (params.anschlussvertrag && params.anschlussvertrag !== "0") ||
    params.bewohnerPlus || params.o2 || params.oxgFiber
  );
}
