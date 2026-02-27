import { describe, expect, it } from "vitest";
import { buildVkdMamasQuery, buildAdsQuery, buildWizardContractQuery } from "./query-builder-vkd";
import { buildUmMamasQuery } from "./query-builder-um";
import { convertEnvToPleEnv, getFallbackDbConfig } from "./oracle-config";

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
    expect(config!.connectString).toContain("mamasgit");
    expect(config!.user).toBe("ne4");
  });

  it("returns fallback ADS config for known environments", () => {
    const config = getFallbackDbConfig("GIT", "ADS", "00");
    expect(config).not.toBeNull();
    expect(config!.connectString).toContain("adsgit");
    expect(config!.user).toBe("ads_read");
  });

  it("returns fallback Wizard config for known environments and regions", () => {
    const config = getFallbackDbConfig("GIT", "WIZARD", "01");
    expect(config).not.toBeNull();
    expect(config!.connectString).toContain("wizprod1git");
  });

  it("returns null for unknown environments", () => {
    const config = getFallbackDbConfig("UNKNOWN", "MAMAS", "00");
    expect(config).toBeNull();
  });
});

describe("VKD Query Builder", () => {
  it("builds a basic MAMAS query with region filter", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      results: "10",
      regions: ["R01", "R02"],
    });
    expect(sql).toContain("NE4.TA_ADRESSE");
    expect(sql).toContain("A_REGION In ('R01', 'R02')");
    expect(sql).toContain("Rownum <= 10");
  });

  it("builds a query with PLZ filter", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      results: "5",
      plz: "15344",
    });
    expect(sql).toContain("A_PLZ = '15344'");
    expect(sql).toContain("Rownum <= 5");
  });

  it("builds a query with workflow KAI filter", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      wfKai: "B",
    });
    expect(sql).toContain("TA_VMBKT_KAI");
    expect(sql).toContain("a_workflow = 'B'");
  });

  it("builds a query with O2 flag using wor_vfw column", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      o2: true,
      wfKai: "B",
    });
    expect(sql).toContain("a_wor_vfw = 'B'");
  });

  it("builds a query with KAA and KAD workflow filters", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      wfKaa: "B",
      wfKad: "A",
    });
    expect(sql).toContain("TA_VMBKT_KAA_KAD");
    expect(sql).toContain("a_workflow = 'B'");
    expect(sql).toContain("A_DIENSTKATEGORIE = 'KAA'");
    expect(sql).toContain("a_workflow = 'A'");
    expect(sql).toContain("A_DIENSTKATEGORIE = 'KAD'");
  });

  it("builds a query with transfer rate filters", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      dsVon: "100",
      dsBis: "1000",
      usVon: "10",
    });
    expect(sql).toContain("TA_VMBKT_TRANSFER_RATE");
    expect(sql).toContain("A_TRR_MAMAS >= '100'");
    expect(sql).toContain("A_TRR_MAMAS <= '1000'");
    expect(sql).toContain("A_TRR_TYP = 'DTR'");
    expect(sql).toContain("A_TRR_TYP = 'UTR'");
  });

  it("builds a Fiber query when oxgFiber is true", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      oxgFiber: true,
      fiberStatus: "1",
    });
    expect(sql).toContain("TA_VMBKT_FIBER");
    expect(sql).toContain("A_TV_FIBER = 1");
  });

  it("builds a query with selfinstall and direkt versorgt", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      selfinstall: "J",
      direktVersorgt: "J",
    });
    expect(sql).toContain("A_SELFINSTALL = 'J'");
    expect(sql).toContain("A_DIREKT_VERSORGT = 'J'");
  });

  it("builds a query with contract situation filters", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      gestattungsvertrag: "A",
      anschlussvertrag: "B",
      salessegment: "MDU",
    });
    expect(sql).toContain("A_CCB1 = 'A'");
    expect(sql).toContain("A_CCB2 = 'B'");
    expect(sql).toContain("A_SALES_SEGMENT = 'MDU'");
  });

  it("builds a query with vertragsnummer and kundennummer", () => {
    const sql = buildVkdMamasQuery({
      environment: "GIT",
      footprint: "Vodafone Kabel",
      vertragsnummer: "123456",
      kundennummer: "789012",
    });
    expect(sql).toContain("TA_VMBKT_WIZARD");
    expect(sql).toContain("A_VERTRAGSNUMMER = '123456'");
    expect(sql).toContain("A_KUNDENNUMMER = '789012'");
  });
});

describe("ADS Query Builder", () => {
  it("builds an ADS query from address IDs", () => {
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

describe("Wizard Contract Query Builder", () => {
  it("builds indirect and direct contract queries", () => {
    const { indirect, direct } = buildWizardContractQuery(["HFC_100", "HFC_200"]);
    expect(indirect).toContain("WIZ_ITEM_MDU");
    expect(indirect).toContain("'HFC_100', 'HFC_200'");
    expect(direct).toContain("WIZ_HP_DESCRIPTION");
    expect(direct).toContain("'HFC_100', 'HFC_200'");
  });
});

describe("UM Query Builder", () => {
  it("builds a basic UM query with region filter", () => {
    const sql = buildUmMamasQuery({
      environment: "GIT",
      footprint: "Unitymedia",
      results: "10",
      regions: ["R05", "R06"],
    });
    expect(sql).toContain("ta_vmbkt_um_dwh");
    expect(sql).toContain("ta_vmbkt_um_delphi");
    expect(sql).toContain("A_ORG In ('5', '6')");
    expect(sql).toContain("Rownum <= 10");
  });

  it("builds a UM query with KAA workflow (Bereitstellung)", () => {
    const sql = buildUmMamasQuery({
      environment: "GIT",
      footprint: "Unitymedia",
      wfKaa: "B",
    });
    expect(sql).toContain("A_KV_KABEL_TV = 'J'");
  });

  it("builds a UM query with KAA workflow (Absage)", () => {
    const sql = buildUmMamasQuery({
      environment: "GIT",
      footprint: "Unitymedia",
      wfKaa: "A",
    });
    expect(sql).toContain("A_KV_KABEL_TV = 'N'");
  });

  it("builds a UM query with KAI workflow and O2 flag", () => {
    const sql = buildUmMamasQuery({
      environment: "GIT",
      footprint: "Unitymedia",
      o2: true,
      wfKai: "B",
    });
    expect(sql).toContain("A_KAI_WOR_VFW = 'B'");
  });

  it("builds a UM query with NE4 status filter", () => {
    const sql = buildUmMamasQuery({
      environment: "GIT",
      footprint: "Unitymedia",
      ne4Status: "AKTIV",
    });
    expect(sql).toContain("A_NE4_STATUS = 'AKTIV'");
  });

  it("builds a UM query with GS2 element filter", () => {
    const sql = buildUmMamasQuery({
      environment: "GIT",
      footprint: "Unitymedia",
      gs2Element: "B2",
    });
    expect(sql).toContain("a_gebaeude_segment_2 = 'B2'");
  });

  it("builds a UM Fiber query when oxgFiber is true", () => {
    const sql = buildUmMamasQuery({
      environment: "GIT",
      footprint: "Unitymedia",
      oxgFiber: true,
      fiberStatus: "2",
    });
    expect(sql).toContain("TA_VMBKT_FIBER");
    expect(sql).toContain("A_TV_FIBER = 2");
    expect(sql).toContain("A_Org In (5, 6, 8)");
  });
});
