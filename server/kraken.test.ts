/**
 * Vitest tests for Kraken query builders and service logic.
 * Updated for the new data model using Views (V_VMBKT_ADS_ALM, V_VMBKT_UM_ADS_ALM).
 */
import { describe, expect, it } from "vitest";
import { buildVkdMamasQuery, buildAdsQuery, buildPlzSearchQuery, hasMamasFilters, type VkdSearchParams } from "./query-builder-vkd";
import { buildUmMamasQuery, hasUmMamasFilters, type UmSearchParams } from "./query-builder-um";
import { convertEnvToPleEnv, getFallbackDbConfig } from "./oracle-config";

// ─── Oracle Config Tests ───

describe("Oracle Config", () => {
  it("converts environment names to PLE format", () => {
    expect(convertEnvToPleEnv("GIT")).toBe("GIT");
    expect(convertEnvToPleEnv("PNA")).toBe("Prodnah");
    expect(convertEnvToPleEnv("3.TEST")).toBe("3. Test");
    expect(convertEnvToPleEnv("4.TEST")).toBe("VT4");
  });

  it("returns fallback MAMAS config for known environments", () => {
    const config = getFallbackDbConfig("GIT", "MAMAS", "00");
    expect(config).not.toBeNull();
    expect(config!.connectString).toBeTruthy();
    expect(config!.user).toBeTruthy();
  });

  it("returns fallback ADS config for known environments", () => {
    const config = getFallbackDbConfig("GIT", "ADS", "00");
    expect(config).not.toBeNull();
    expect(config!.connectString).toBeTruthy();
    expect(config!.user).toBeTruthy();
  });

  it("returns null for unknown environments", () => {
    const config = getFallbackDbConfig("UNKNOWN", "MAMAS", "00");
    expect(config).toBeNull();
  });
});

// ─── VKD Query Builder Tests (V_VMBKT_ADS_ALM) ───

describe("VKD Query Builder (V_VMBKT_ADS_ALM)", () => {
  it("builds a basic query with region and workflow", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      results: "10",
      regions: ["R01"],
      wfKaa: "B",
    });
    expect(sql).toContain("NE4.V_VMBKT_ADS_ALM");
    expect(sql).toContain("OBJ_REGION In ('R01')");
    expect(sql).toContain("KAA_WORKFLOW = 'B'");
    expect(sql).toContain("Rownum <= 10");
  });

  it("uses KAI_WOR_VFW when O2 is enabled", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      o2: true,
      wfKai: "A",
    });
    expect(sql).toContain("KAI_WOR_VFW = 'A'");
    expect(sql).not.toContain("KAI_WORKFLOW");
  });

  it("adds A_WSF = 'J' subquery against TA_VMBKT_OBJEKT when O2 is enabled (VKD)", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      o2: true,
      wfKai: "B",
    });
    // Groovy: params.ta_vmbkt_objekt.a_wsf = 'J' → queryTaVmbktObjekt adds subquery
    expect(sql).toContain("NE4.TA_VMBKT_OBJEKT");
    expect(sql).toContain("A_WSF = 'J'");
    expect(sql).toContain("KAI_WOR_VFW = 'B'");
  });

  it("does NOT add A_WSF subquery when O2 is not enabled (VKD)", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      wfKai: "B",
    });
    expect(sql).not.toContain("A_WSF");
    expect(sql).toContain("KAI_WORKFLOW = 'B'");
  });

  it("uses KAI_WORKFLOW when O2 is not enabled", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      wfKai: "B",
    });
    expect(sql).toContain("KAI_WORKFLOW = 'B'");
    expect(sql).not.toContain("KAI_WOR_VFW");
  });

  it("includes view columns: SEL_TV, OBJ_VERSORGUNGSART, OBJ_MAX_WE", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      selfinstall: "J",
      direktVersorgt: "J",
      maxWeVon: "5",
      maxWeBis: "50",
    });
    expect(sql).toContain("SEL_TV = 'J'");
    expect(sql).toContain("OBJ_VERSORGUNGSART = 'D'");
    expect(sql).toContain("OBJ_MAX_WE >= '5'");
    expect(sql).toContain("OBJ_MAX_WE <= '50'");
  });

  it("includes view columns: DTR_MAMAS, UTR_MAMAS", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      dsVon: "100",
      dsBis: "1000",
      usVon: "10",
      usBis: "100",
    });
    expect(sql).toContain("DTR_MAMAS >= '100'");
    expect(sql).toContain("DTR_MAMAS <= '1000'");
    expect(sql).toContain("UTR_MAMAS >= '10'");
    expect(sql).toContain("UTR_MAMAS <= '100'");
  });

  it("includes TV columns: KAA_TV, KAD_TV, KAI_TV, OBJ_UEP_ZUSTAND", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      tvKaa: "J",
      tvKad: "N",
      tvKai: "J",
      uepZustand: "aktiv",
    });
    expect(sql).toContain("KAA_TV = 'J'");
    expect(sql).toContain("KAD_TV = 'N'");
    expect(sql).toContain("KAI_TV = 'J'");
    expect(sql).toContain("OBJ_UEP_ZUSTAND = 'aktiv'");
  });

  it("uses subquery for DOCSIS/ABK/FTTB against TA_VMBKT_OBJEKT", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      docsis: "3.1",
      abk: "J",
      fttb: "Fiber",
    });
    expect(sql).toContain("NE4.TA_VMBKT_OBJEKT");
    expect(sql).toContain("A_DOCSIS = '3.1'");
    expect(sql).toContain("A_ABK_FLAG = 'J'");
    expect(sql).toContain("A_FIBER_COAX_FLAG = 'Fiber'");
  });

  it("uses V_WIZ_CUSTOMER_CONTRACTS for contract number (no Wizard-DB)", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      vertragsnummer: "12345",
    });
    expect(sql).toContain("NE4.V_WIZ_CUSTOMER_CONTRACTS");
    expect(sql).toContain("CONTRACT_NUMBER = '12345'");
  });

  it("uses V_WIZ_CUSTOMER_CONTRACTS for customer number", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      kundennummer: "789012",
    });
    expect(sql).toContain("NE4.V_WIZ_CUSTOMER_CONTRACTS");
    expect(sql).toContain("ACCOUNT_NUMBER = '789012'");
  });

  it("uses V_WIZ_CUSTOMER_CONTRACTS for contract codes with STATUS=AK", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      vertragscodes: ["KI", "KA"],
    });
    expect(sql).toContain("NE4.V_WIZ_CUSTOMER_CONTRACTS");
    expect(sql).toContain("CONTRACT_CODE In ('KI', 'KA')");
    expect(sql).toContain("CONTRACT_STATUS = 'AK'");
  });

  it("uses V_VERMARKTBARKEIT_OBJEKT for CCB1/CCB2", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      gestattungsvertrag: "A",
      anschlussvertrag: "C",
    });
    expect(sql).toContain("NE4.V_VERMARKTBARKEIT_OBJEKT");
    expect(sql).toContain("A_CCB1 = 'A'");
    expect(sql).toContain("A_CCB2 = 'C'");
  });

  it("includes VWZ_VERTRIEBSSEGMENT for salessegment", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      salessegment: "B2C",
    });
    expect(sql).toContain("VWZ_VERTRIEBSSEGMENT = 'B2C'");
  });

  it("passes address ID filter from PLZ pre-search", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      wfKaa: "B",
    }, [100, 200, 300]);
    expect(sql).toContain("OBJ_ADRESSE_ID In (100, 200, 300)");
    expect(sql).toContain("KAA_WORKFLOW = 'B'");
  });

  it("builds fiber query when oxgFiber is set with OBJ_ADRESSE_ID alias", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      oxgFiber: true,
      fiberStatus: "1",
      regions: ["R01"],
    });
    expect(sql).toContain("NE4.TA_VMBKT_FIBER");
    expect(sql).toContain("A_TV_FIBER = 1");
    // Must alias A_Adresse_ID as OBJ_ADRESSE_ID for kraken-service.ts
    expect(sql).toContain("A_Adresse_ID As OBJ_ADRESSE_ID");
  });

  it("builds a minimal query with no filters", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      results: "50",
    });
    expect(sql).toContain("NE4.V_VMBKT_ADS_ALM");
    expect(sql).toContain("Rownum <= 50");
  });
});

// ─── PLZ Search Tests ───

describe("PLZ Search (ADS.TA_ADRESSE)", () => {
  it("builds PLZ ID-only query with A_V_PLZ_SUCH (indexed)", () => {
    const sql = buildPlzSearchQuery("50667", true, "1000");
    expect(sql).toContain("ADS.TA_ADRESSE");
    expect(sql).toContain("A_V_PLZ_SUCH = '50667'");
    expect(sql).toContain("A_SERVICEADRESSE = 'J'");
    expect(sql).toContain("Rownum <= 1000");
    expect(sql).not.toContain("A_PLZ ="); // Must NOT use A_PLZ (not indexed)
  });

  it("builds PLZ full-result query", () => {
    const sql = buildPlzSearchQuery("50667", false, "100");
    expect(sql).toContain("OBJEKT_ID");
    expect(sql).toContain("ADRESSE");
    expect(sql).toContain("ONKZ");
    expect(sql).toContain("A_V_PLZ_SUCH = '50667'");
  });
});

// ─── ADS Query Tests ───

describe("ADS Query Builder", () => {
  it("builds ADS query from address IDs", () => {
    const sql = buildAdsQuery([100, 200, 300], "10");
    expect(sql).toContain("ADS.TA_ADRESSE");
    expect(sql).toContain("100, 200, 300");
    expect(sql).toContain("Rownum <= 10");
    expect(sql).toContain("A_PLZ");
    expect(sql).toContain("A_STRNAME");
  });

  it("returns empty string for empty address IDs", () => {
    const sql = buildAdsQuery([], "10");
    expect(sql).toBe("");
  });
});

// ─── hasMamasFilters Tests ───

describe("hasMamasFilters", () => {
  it("returns false for PLZ-only params", () => {
    expect(hasMamasFilters({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      plz: "50667",
    })).toBe(false);
  });

  it("returns true when workflow is set", () => {
    expect(hasMamasFilters({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      plz: "50667",
      wfKaa: "B",
    })).toBe(true);
  });

  it("returns true when regions are set", () => {
    expect(hasMamasFilters({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      plz: "50667",
      regions: ["R01"],
    })).toBe(true);
  });

  it("returns true when contract codes are set", () => {
    expect(hasMamasFilters({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      plz: "50667",
      vertragscodes: ["KI"],
    })).toBe(true);
  });
});

// ─── UM Query Builder Tests (V_VMBKT_UM_ADS_ALM) ───

describe("UM Query Builder (V_VMBKT_UM_ADS_ALM)", () => {
  it("builds a basic UM query with region and workflow", () => {
    const sql = buildUmMamasQuery({
      environment: "GIT",
      footprint: "Unitymedia",
      results: "10",
      regions: ["R05"],
      wfKaa: "B",
    });
    expect(sql).toContain("NE4.V_VMBKT_UM_ADS_ALM");
    expect(sql).toContain("OBJ_ORG In ('5')");
    expect(sql).toContain("KAA_WORKFLOW = 'B'");
    expect(sql).toContain("Rownum <= 10");
  });

  it("uses OBJ_NE4_STATUS for NE4 status filter", () => {
    const sql = buildUmMamasQuery({
      environment: "GIT",
      footprint: "Unitymedia",
      ne4Status: "aktiv",
    });
    expect(sql).toContain("OBJ_NE4_STATUS = 'aktiv'");
  });

  it("uses OBJ_ABK_FLAG and OBJ_FIBER_COAX_FLAG on the view (not subquery)", () => {
    const sql = buildUmMamasQuery({
      environment: "GIT",
      footprint: "Unitymedia",
      abk: "J",
      fttb: "Fiber",
    });
    expect(sql).toContain("OBJ_ABK_FLAG = 'J'");
    expect(sql).toContain("OBJ_FIBER_COAX_FLAG = 'Fiber'");
    expect(sql).not.toContain("TA_VMBKT_OBJEKT");
  });

  it("uses subquery for DOCSIS against TA_VMBKT_UM_DELPHI", () => {
    const sql = buildUmMamasQuery({
      environment: "GIT",
      footprint: "Unitymedia",
      docsis: "3.1",
    });
    expect(sql).toContain("NE4.TA_VMBKT_UM_DELPHI");
    expect(sql).toContain("A_DOCSIS = '3.1'");
  });

  it("uses OBJ_SEL_VERFUEGBAR for selfinstall", () => {
    const sql = buildUmMamasQuery({
      environment: "GIT",
      footprint: "Unitymedia",
      selfinstall: "J",
    });
    expect(sql).toContain("OBJ_SEL_VERFUEGBAR = 'J'");
  });

  it("uses OBJ_GS2 for GS2 element", () => {
    const sql = buildUmMamasQuery({
      environment: "GIT",
      footprint: "Unitymedia",
      gs2Element: "B2",
    });
    expect(sql).toContain("OBJ_GS2 = 'B2'");
  });

  it("uses OBJ_UEP_ZUSTAND for ÜP-Zustand", () => {
    const sql = buildUmMamasQuery({
      environment: "GIT",
      footprint: "Unitymedia",
      uepZustand: "aktiv",
    });
    expect(sql).toContain("OBJ_UEP_ZUSTAND = 'aktiv'");
  });

  it("passes address ID filter from PLZ pre-search", () => {
    const sql = buildUmMamasQuery({
      environment: "GIT",
      footprint: "Unitymedia",
      wfKaa: "B",
    }, [100, 200]);
    expect(sql).toContain("OBJ_ADRESSE_ID In (100, 200)");
  });

  it("uses KAI_WOR_VFW when O2 is enabled", () => {
    const sql = buildUmMamasQuery({
      environment: "GIT",
      footprint: "Unitymedia",
      o2: true,
      wfKai: "A",
    });
    expect(sql).toContain("KAI_WOR_VFW = 'A'");
  });

  it("includes O2 Überlastung subquery and sets KAI_WORKFLOW = 'J'", () => {
    const sql = buildUmMamasQuery({
      environment: "GIT",
      footprint: "Unitymedia",
      o2: true,
      wfKai: "S",
    });
    expect(sql).toContain("TA_SEGMENT_KPI_WOCHE");
    expect(sql).toContain("A_WS_KPI_PT_DS_US = 'R'");
    // Überlastung: KAI_WORKFLOW = 'J' (not KAI_WOR_VFW = 'S')
    expect(sql).toContain("KAI_WORKFLOW = 'J'");
    expect(sql).not.toContain("KAI_WOR_VFW = 'S'");
  });

  it("does not set any KAI filter when O2 is checked but no wfKai selected", () => {
    const sql = buildUmMamasQuery({
      environment: "GIT",
      footprint: "Unitymedia",
      o2: true,
      regions: ["R05"],
    });
    expect(sql).not.toContain("KAI_WOR_VFW");
    expect(sql).not.toContain("KAI_WORKFLOW");
    expect(sql).toContain("OBJ_ORG In ('5')");
  });

  it("uses KAA Vorvermarktung GS2 filter for wfKaa=V", () => {
    const sql = buildUmMamasQuery({
      environment: "GIT",
      footprint: "Unitymedia",
      wfKaa: "V",
    });
    expect(sql).toContain("OBJ_GS2 In ('B2', 'B3', 'B4', 'B5', 'B6', 'B7')");
    expect(sql).not.toContain("KAA_WORKFLOW");
  });

  it("builds UM Fiber query when oxgFiber is true with OBJ_ADRESSE_ID alias", () => {
    const sql = buildUmMamasQuery({
      environment: "GIT",
      footprint: "Unitymedia",
      oxgFiber: true,
      fiberStatus: "2",
    });
    expect(sql).toContain("TA_VMBKT_FIBER");
    expect(sql).toContain("A_TV_FIBER = 2");
    expect(sql).toContain("A_Org In (5, 6, 8)");
    // Must alias A_Adresse_ID as OBJ_ADRESSE_ID for kraken-service.ts
    expect(sql).toContain("A_Adresse_ID As OBJ_ADRESSE_ID");
  });
});

// ─── hasUmMamasFilters Tests ───

describe("hasUmMamasFilters", () => {
  it("returns false for PLZ-only params", () => {
    expect(hasUmMamasFilters({
      environment: "GIT",
      footprint: "Unitymedia",
      plz: "50667",
    })).toBe(false);
  });

  it("returns true when NE4 status is set", () => {
    expect(hasUmMamasFilters({
      environment: "GIT",
      footprint: "Unitymedia",
      plz: "50667",
      ne4Status: "aktiv",
    })).toBe(true);
  });

  it("returns true when GS2 element is set", () => {
    expect(hasUmMamasFilters({
      environment: "GIT",
      footprint: "Unitymedia",
      plz: "50667",
      gs2Element: "B2",
    })).toBe(true);
  });
});
