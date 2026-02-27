/**
 * Kraken Data Model - based on kraken_mamas_tables.xlsx
 *
 * This file documents the database mapping for both footprints.
 * The actual SQL queries are constructed on the backend.
 * This file serves as reference documentation and for API parameter validation.
 */

// ===== VKD (Vodafone Kabel) Data Model =====
export const VKD_MODEL = {
  // Main view for most filters
  mainView: "NE4.V_VMBKT_ADS_ALM",
  // Additional tables
  objektTable: "NE4.TA_VMBKT_OBJEKT",
  contractView: "NE4.V_WIZ_CUSTOMER_CONTRACTS",
  vermarktbarkeitView: "NE4.V_VERMARKTBARKEIT_OBJEKT",
  adsTable: "ADS.TA_ADRESSE",

  // Field mappings: GUI Parameter -> DB Property
  fields: {
    region: { property: "OBJ_REGION", table: "V_VMBKT_ADS_ALM" },
    o2: { property: "KAI_WOR_VFW", table: "V_VMBKT_ADS_ALM" },
    wfKaa: { property: "KAA_WORKFLOW", table: "V_VMBKT_ADS_ALM" },
    wfKad: { property: "KAD_WORKFLOW", table: "V_VMBKT_ADS_ALM" },
    wfKai: { property: "KAI_WORKFLOW", table: "V_VMBKT_ADS_ALM" },
    selfinstall: { property: "SEL_TV", table: "V_VMBKT_ADS_ALM" },
    direktVersorgt: { property: "OBJ_VERSORGUNGSART", table: "V_VMBKT_ADS_ALM" },
    maxWe: { property: "OBJ_MAX_WE", table: "V_VMBKT_ADS_ALM" },
    dsRate: { property: "DTR_MAMAS", table: "V_VMBKT_ADS_ALM" },
    usRate: { property: "UTR_MAMAS", table: "V_VMBKT_ADS_ALM" },
    docsis: { property: "A_DOCSIS", table: "TA_VMBKT_OBJEKT" },
    abk: { property: "A_ABK_FLAG", table: "TA_VMBKT_OBJEKT" },
    fttb: { property: "A_FIBER_COAX_FLAG", table: "TA_VMBKT_OBJEKT" },
    tvKaa: { property: "KAA_TV", table: "V_VMBKT_ADS_ALM" },
    tvKad: { property: "KAD_TV", table: "V_VMBKT_ADS_ALM" },
    tvKai: { property: "KAI_TV", table: "V_VMBKT_ADS_ALM" },
    uepZustand: { property: "OBJ_UEP_ZUSTAND", table: "V_VMBKT_ADS_ALM" },
    vertragsnummer: { property: "CONTRACT_NUMBER", table: "V_WIZ_CUSTOMER_CONTRACTS" },
    kundennummer: { property: "ACCOUNT_NUMBER", table: "V_WIZ_CUSTOMER_CONTRACTS" },
    gestattungsvertrag: { property: "A_CCB1", table: "V_VERMARKTBARKEIT_OBJEKT" },
    anschlussvertrag: { property: "A_CCB2", table: "V_VERMARKTBARKEIT_OBJEKT" },
    salessegment: { property: "VWZ_VERTRIEBSSEGMENT", table: "V_VMBKT_ADS_ALM" },
    vertragscode: { property: "CONTRACT_CODE", table: "V_WIZ_CUSTOMER_CONTRACTS", extraCondition: "CONTRACT_STATUS = 'AK'" },
  },

  // Result fields
  result: {
    objektId: { property: "A_Adresse_ID", table: "ADS.TA_ADRESSE" },
    adresse: { expression: "A_PLZ || ' ' || A_ORTSNAME || ', ' || A_STRNAME || ' ' || A_HAUSNR || ' ' || A_HAUSNR_ZUS", table: "ADS.TA_ADRESSE" },
    onkz: { property: "A_REF_TELEFONIE_ONKZ", table: "ADS.TA_ADRESSE" },
  },
};

// ===== UM (Unitymedia) Data Model =====
export const UM_MODEL = {
  mainView: "NE4.V_VMBKT_UM_ADS_ALM",
  delphiTable: "NE4.TA_VMBKT_UM_DELPHI",
  adsTable: "ADS.TA_ADRESSE",

  fields: {
    region: { property: "OBJ_ORG", table: "V_VMBKT_UM_ADS_ALM" },
    o2: { property: "KAI_WOR_VFW", table: "V_VMBKT_UM_ADS_ALM" },
    wfKaa: { property: "KAA_WORKFLOW", table: "V_VMBKT_UM_ADS_ALM" },
    wfKad: { property: "KAD_WORKFLOW", table: "V_VMBKT_UM_ADS_ALM" },
    wfKai: { property: "KAI_WORKFLOW", table: "V_VMBKT_UM_ADS_ALM" },
    selfinstall: { property: "OBJ_SEL_VERFUEGBAR", table: "V_VMBKT_UM_ADS_ALM" },
    maxWe: { property: "OBJ_MAX_WE", table: "V_VMBKT_UM_ADS_ALM" },
    dsRate: { property: "DTR_MAMAS", table: "V_VMBKT_UM_ADS_ALM" },
    usRate: { property: "UTR_MAMAS", table: "V_VMBKT_UM_ADS_ALM" },
    docsis: { property: "A_DOCSIS", table: "TA_VMBKT_UM_DELPHI" },
    ne4Status: { property: "OBJ_NE4_STATUS", table: "V_VMBKT_UM_ADS_ALM" },
    abk: { property: "OBJ_ABK_FLAG", table: "V_VMBKT_UM_ADS_ALM" },
    fttb: { property: "OBJ_FIBER_COAX_FLAG", table: "V_VMBKT_UM_ADS_ALM" },
    tvKaa: { property: "KAA_TV", table: "V_VMBKT_UM_ADS_ALM" },
    tvKad: { property: "KAD_TV", table: "V_VMBKT_UM_ADS_ALM" },
    tvKai: { property: "KAI_TV", table: "V_VMBKT_UM_ADS_ALM" },
    uepZustand: { property: "OBJ_UEP_ZUSTAND", table: "V_VMBKT_UM_ADS_ALM" },
    gs2Element: { property: "OBJ_GS2", table: "V_VMBKT_UM_ADS_ALM" },
  },

  result: {
    objektId: { property: "A_Adresse_ID", table: "ADS.TA_ADRESSE" },
    umAdresseId: { property: "A_UM_GEBAEUDE_ID", table: "ADS.TA_ADRESSE" },
    adresse: { expression: "A_PLZ || ' ' || A_ORTSNAME || ', ' || A_STRNAME || ' ' || A_HAUSNR || ' ' || A_HAUSNR_ZUS", table: "ADS.TA_ADRESSE" },
    onkz: { property: "A_REF_TELEFONIE_ONKZ", table: "ADS.TA_ADRESSE" },
  },
};

// PLZ Search (both footprints)
export const PLZ_SEARCH = {
  table: "ADS.TA_ADRESSE",
  condition: "A_SERVICEADRESSE = 'J' AND A_V_PLZ_SUCH = :plz",
  maxRows: 10000,
  resultFields: {
    objektId: "A_Adresse_ID",
    umAdresseId: "A_UM_GEBAEUDE_ID",
    adresse: "A_PLZ || ' ' || A_ORTSNAME || ', ' || A_STRNAME || ' ' || A_HAUSNR || ' ' || A_HAUSNR_ZUS",
    onkz: "A_REF_TELEFONIE_ONKZ",
  },
};
