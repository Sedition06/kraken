/**
 * SQL Query Builder for VKD (Vodafone Kabel) Footprint
 * 
 * Ported from the original Grails AdsService.groovy.
 * Builds SQL queries against the MAMAS NE4 schema (V_VMBKT_ADS_ALM views).
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

/**
 * Build the main MAMAS query for VKD footprint.
 * Returns the SQL string to get A_Adresse_ID values.
 */
export function buildVkdMamasQuery(params: VkdSearchParams): string {
  if (params.oxgFiber) {
    return buildFiberQuery(params);
  }
  
  const whereParts: string[] = [];
  
  // TA_VMBKT_OBJEKT subquery
  const objektPart = buildTaVmbktObjekt(params);
  if (objektPart) whereParts.push(objektPart);
  
  // TA_VMBKT_KAI subquery
  const kaiPart = buildTaVmbktKai(params);
  if (kaiPart) whereParts.push(kaiPart);
  
  // TA_VMBKT_KAA_KAD subquery
  const kaaKadPart = buildTaVmbktKaaKad(params);
  if (kaaKadPart) whereParts.push(kaaKadPart);
  
  // TA_VMBKT_WIZARD subquery
  const wizardPart = buildTaVmbktWizard(params);
  if (wizardPart) whereParts.push(wizardPart);
  
  // TA_VMBKT_TRANSFER_RATE subquery
  const transferRatePart = buildTaVmbktTransferRate(params);
  if (transferRatePart) whereParts.push(transferRatePart);
  
  const maxRows = params.results || DEFAULT_MAX_ROWS;
  
  // Build final SELECT
  const selectPart = `Select /*+ parallel(${PARALLEL_THREADS}) */\n        A_Adresse_ID From NE4.TA_ADRESSE\n  Where `;
  
  let whereClause = whereParts.join(" ");
  // Clean up leading "And "
  whereClause = whereClause.replace(/^\s*And\s+/i, "");
  
  if (whereClause) {
    return selectPart + whereClause + ` And Rownum <= ${maxRows}`;
  } else {
    return selectPart + `Rownum <= ${maxRows}`;
  }
}

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

/**
 * Build Wizard contract code query.
 */
export function buildWizardContractQuery(contracts: string[]): { indirect: string; direct: string } {
  const contractList = contracts.map(c => `'${c}'`).join(", ");
  
  const indirect = `
SELECT
    BUILDING_ID As A_Adresse_ID
FROM
    WIZ_ITEM_MDU
WHERE
    CONTRACT_NUMBER IN
    (
        SELECT
            CONTRACT_NUMBER
        FROM
            WIZ_CUSTOMER_CONTRACTS
        WHERE
            CONTRACT_CODE IN (${contractList})
        AND CONTRACT_STATUS = 'AK')
AND rownum <= 100`;

  const direct = `
SELECT
    BUILDING_ID As A_Adresse_ID
FROM
    WIZ_HP_DESCRIPTION
WHERE
    SERVICE_ADDRESS_ID IN
    (
        SELECT
            SERVICE_ADDRESS_ID
        FROM
            WIZ_CUSTOMER_CONTRACTS
        WHERE
            CONTRACT_CODE IN (${contractList})
        AND CONTRACT_STATUS = 'AK')
AND rownum <= 100`;

  return { indirect, direct };
}

// ─── Sub-query builders ───

function buildRegionFilter(regions?: string[]): string {
  if (!regions || regions.length === 0) return "";
  const regionList = regions.map(r => `'${r}'`).join(", ");
  return `And A_REGION In (${regionList})`;
}

function buildTaVmbktObjekt(params: VkdSearchParams): string {
  const conditions: string[] = [];
  
  // Regions
  if (params.regions && params.regions.length > 0) {
    const regionList = params.regions.map(r => `'${r}'`).join(", ");
    conditions.push(`A_REGION In (${regionList})`);
  }
  
  // PLZ
  if (params.plz && params.plz.length === 5) {
    conditions.push(`A_PLZ = '${params.plz}'`);
  }
  
  // Selfinstall
  if (params.selfinstall && params.selfinstall !== "*") {
    conditions.push(`A_SELFINSTALL = '${params.selfinstall}'`);
  }
  
  // Direkt Versorgt
  if (params.direktVersorgt && params.direktVersorgt !== "*") {
    conditions.push(`A_DIREKT_VERSORGT = '${params.direktVersorgt}'`);
  }
  
  // Max WE (von/bis)
  if (params.maxWeVon) {
    conditions.push(`a_max_we >= '${params.maxWeVon}'`);
  }
  if (params.maxWeBis) {
    conditions.push(`a_max_we <= '${params.maxWeBis}'`);
  }
  
  // ABK
  if (params.abk && params.abk !== "*") {
    conditions.push(`A_ABK_FLAG = '${params.abk}'`);
  }
  
  // FTTB / Fiber-Coax
  if (params.fttb && params.fttb !== "*") {
    conditions.push(`A_FIBER_COAX_FLAG = '${params.fttb}'`);
  }
  
  // DOCSIS
  if (params.docsis) {
    conditions.push(`A_DOCSIS = '${params.docsis}'`);
  }
  
  // ÜP-Zustand
  if (params.uepZustand && params.uepZustand !== "*") {
    conditions.push(`A_UEP_ZUSTAND = '${params.uepZustand}'`);
  }
  
  // O2 flag
  if (params.o2) {
    conditions.push(`A_WSF = 'J'`);
  }
  
  // Gestattungsvertrag (CCB1)
  if (params.gestattungsvertrag && params.gestattungsvertrag !== "0") {
    conditions.push(`A_CCB1 = '${params.gestattungsvertrag}'`);
  }
  
  // Anschlussvertrag (CCB2)
  if (params.anschlussvertrag && params.anschlussvertrag !== "0") {
    conditions.push(`A_CCB2 = '${params.anschlussvertrag}'`);
  }
  
  // Salessegment
  if (params.salessegment) {
    conditions.push(`A_SALES_SEGMENT = '${params.salessegment}'`);
  }
  
  if (conditions.length === 0) return "";
  
  return `And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_OBJEKT Where ${conditions.join(" And ")})`;
}

function buildTaVmbktKai(params: VkdSearchParams): string {
  const conditions: string[] = [];
  
  // Workflow KAI
  if (params.wfKai) {
    const field = params.o2 ? "a_wor_vfw" : "a_workflow";
    conditions.push(`${field} = '${params.wfKai}'`);
  }
  
  // TV KAI
  if (params.tvKai) {
    conditions.push(`a_tv = '${params.tvKai}'`);
  }
  
  // BewohnerPlus KAI
  if (params.bewohnerPlus && params.bpKai) {
    const bpVal = `'${params.bpKai}'`;
    if (params.bpKai === "N") {
      conditions.push(`(A_MBO_FLAG_KAN_GRP IN (SELECT A_KANAL_GRUPPE_ID FROM NE4.TA_KANAL_GRUPPE WHERE A_PUB = ${bpVal}) Or A_MBO_FLAG_KAN_GRP IS NULL)`);
    } else {
      conditions.push(`(A_MBO_FLAG_KAN_GRP IN (SELECT A_KANAL_GRUPPE_ID FROM NE4.TA_KANAL_GRUPPE WHERE A_PUB = ${bpVal}) OR A_ADRESSE_ID In (SELECT A_ADRESSE_ID FROM NE4.TA_VMBKT_OBJEKT WHERE A_CCB2 in ('A','C','F','L','E','D')))`);
    }
  }
  
  if (conditions.length === 0) return "";
  
  return ` And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_KAI Where ${conditions.join(" And ")})`;
}

function buildTaVmbktKaaKad(params: VkdSearchParams): string {
  const parts: string[] = [];
  
  // KAA part
  const kaaConditions: string[] = [];
  if (params.wfKaa) {
    kaaConditions.push(`(a_workflow = '${params.wfKaa}' And A_DIENSTKATEGORIE = 'KAA')`);
  }
  if (params.tvKaa) {
    kaaConditions.push(`(a_tv = '${params.tvKaa}' And A_DIENSTKATEGORIE = 'KAA')`);
  }
  
  if (kaaConditions.length > 0) {
    parts.push(` And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_KAA_KAD Where ${kaaConditions.join(" And ")})`);
  }
  
  // KAD part
  const kadConditions: string[] = [];
  if (params.wfKad) {
    kadConditions.push(`(a_workflow = '${params.wfKad}' And A_DIENSTKATEGORIE = 'KAD')`);
  }
  if (params.tvKad) {
    kadConditions.push(`(a_tv = '${params.tvKad}' And A_DIENSTKATEGORIE = 'KAD')`);
  }
  
  if (kadConditions.length > 0) {
    parts.push(` And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_KAA_KAD Where ${kadConditions.join(" And ")})`);
  }
  
  // BewohnerPlus KAA
  if (params.bewohnerPlus && params.bpKaa) {
    const bpVal = `'${params.bpKaa}'`;
    const dikaKaa = " And A_DIENSTKATEGORIE = 'KAA')";
    if (params.bpKaa === "N") {
      parts.push(`And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_KAA_KAD Where (A_MBO_FLAG_KAN_GRP IN (SELECT A_KANAL_GRUPPE_ID FROM NE4.TA_KANAL_GRUPPE WHERE A_PUB = ${bpVal})${dikaKaa} Or (A_MBO_FLAG_KAN_GRP IS NULL${dikaKaa})`);
    } else {
      parts.push(`And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_KAA_KAD Where (A_MBO_FLAG_KAN_GRP IN (SELECT A_KANAL_GRUPPE_ID FROM NE4.TA_KANAL_GRUPPE WHERE A_PUB = ${bpVal})${dikaKaa} OR A_ADRESSE_ID In (SELECT A_ADRESSE_ID FROM NE4.TA_VMBKT_OBJEKT WHERE A_CCB2 in ('A','C','F','L','E','D'))${dikaKaa})`);
    }
  }
  
  // BewohnerPlus KAD
  if (params.bewohnerPlus && params.bpKad) {
    const bpVal = `'${params.bpKad}'`;
    const dikaKad = " And A_DIENSTKATEGORIE = 'KAD')";
    if (params.bpKad === "N") {
      parts.push(`And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_KAA_KAD Where (A_MBO_FLAG_KAN_GRP IN (SELECT A_KANAL_GRUPPE_ID FROM NE4.TA_KANAL_GRUPPE WHERE A_PUB = ${bpVal})${dikaKad} Or (A_MBO_FLAG_KAN_GRP IS NULL${dikaKad})`);
    } else {
      parts.push(`And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_KAA_KAD Where (A_MBO_FLAG_KAN_GRP IN (SELECT A_KANAL_GRUPPE_ID FROM NE4.TA_KANAL_GRUPPE WHERE A_PUB = ${bpVal})${dikaKad} OR A_ADRESSE_ID In (SELECT A_ADRESSE_ID FROM NE4.TA_VMBKT_OBJEKT WHERE A_CCB2 in ('A','C','F','L','E','D'))${dikaKad})`);
    }
  }
  
  return parts.join("");
}

function buildTaVmbktWizard(params: VkdSearchParams): string {
  const conditions: string[] = [];
  
  // Vertragsnummer
  if (params.vertragsnummer) {
    conditions.push(`A_VERTRAGSNUMMER = '${params.vertragsnummer}'`);
  }
  
  // Kundennummer
  if (params.kundennummer) {
    conditions.push(`A_KUNDENNUMMER = '${params.kundennummer}'`);
  }
  
  if (conditions.length === 0) return "";
  
  return ` And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_WIZARD Where ${conditions.join(" And ")})`;
}

function buildTaVmbktTransferRate(params: VkdSearchParams): string {
  const parts: string[] = [];
  
  // DS (Downstream) - DTR type
  const dsConditions: string[] = [];
  if (params.dsVon) {
    dsConditions.push(`(A_TRR_MAMAS >= '${params.dsVon}' And A_TRR_TYP = 'DTR')`);
  }
  if (params.dsBis) {
    dsConditions.push(`(A_TRR_MAMAS <= '${params.dsBis}' And A_TRR_TYP = 'DTR')`);
  }
  if (dsConditions.length > 0) {
    parts.push(` And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_TRANSFER_RATE Where ${dsConditions.join(" And ")})`);
  }
  
  // US (Upstream) - UTR type
  const usConditions: string[] = [];
  if (params.usVon) {
    usConditions.push(`(A_TRR_MAMAS >= '${params.usVon}' And A_TRR_TYP = 'UTR')`);
  }
  if (params.usBis) {
    usConditions.push(`(A_TRR_MAMAS <= '${params.usBis}' And A_TRR_TYP = 'UTR')`);
  }
  if (usConditions.length > 0) {
    parts.push(` And A_Adresse_ID IN (Select A_Adresse_ID From NE4.TA_VMBKT_TRANSFER_RATE Where ${usConditions.join(" And ")})`);
  }
  
  return parts.join("");
}

function buildFiberQuery(params: VkdSearchParams): string {
  const conditions: string[] = [];
  
  // Region filter for Fiber
  if (params.regions && params.regions.length > 0) {
    const regionNums = params.regions.map(r => r.replace("R0", "")).join(", ");
    conditions.push(`A_Org In (${regionNums})`);
  } else {
    // Default: VKD regions
    conditions.push("A_Org In (1, 2, 3, 4, 7, 9)");
  }
  
  // Fiber status
  if (params.fiberStatus) {
    conditions.push(`A_TV_FIBER = ${params.fiberStatus}`);
  }
  
  const maxRows = params.results || "100";
  const whereClause = conditions.join(" And ");
  
  return `Select A_Adresse_ID From NE4.TA_VMBKT_FIBER Where ${whereClause} And Rownum <= ${maxRows}`;
}
