import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useKrakenForm } from "@/hooks/useKrakenForm";
import { CollapsiblePanel } from "@/components/CollapsiblePanel";
import { KrakenSelect } from "@/components/KrakenSelect";
import { ColorSelect } from "@/components/ColorSelect";
import { MultiSelect } from "@/components/MultiSelect";
import {
  IMAGES, VERSION, ENVIRONMENTS, FOOTPRINTS,
  REGIONS_VKD, REGIONS_UM, DEFAULT_MAX_ROWS,
  WF_KAA, WF_KAD, WF_KAI, WF_UY_KAA, WF_UY, WF_UY_O2,
  TV_KAA, TV_KAD, TV_KAI, TV_UY,
  UEP_ZUSTAND_VKD, UEP_ZUSTAND_UM,
  DOCSIS, UM_NE4_STATUS, SALES_SEGMENT, CCB1, CCB2,
  CONTRACT_CODES, GS2_ELEMENT, FIBER_STATUS,
  JA_NEIN, JA_NEIN_BEIDES, COAX_FIBER_BEIDES,
  MAMAS_CLIENT_URLS,
  WF_KAA_EN, WF_KAD_EN, WF_KAI_EN, WF_UY_KAA_EN, WF_UY_EN, WF_UY_O2_EN,
  TV_KAA_EN, TV_KAD_EN, TV_KAI_EN, TV_UY_EN,
  JA_NEIN_EN, JA_NEIN_BEIDES_EN, COAX_FIBER_BEIDES_EN, CCB1_EN, CCB2_EN,
} from "@/lib/config";

interface SearchResult {
  OBJEKT_ID: string;
  UM_ADRESSE_ID?: string;
  ADRESSE: string;
  ONKZ?: string;
}

export default function Home() {
  const { lang, setLang, t } = useLanguage();
  const { form, updateField, initializeForm, isUnitymedia, isVKD } = useKrakenForm();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [sqlQuery, setSqlQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const regions = isUnitymedia ? REGIONS_UM : REGIONS_VKD;

  // Option getters based on footprint and language
  const getWfKaa = () => (isUnitymedia ? (lang === "en" ? WF_UY_KAA_EN : WF_UY_KAA) : (lang === "en" ? WF_KAA_EN : WF_KAA));
  const getWfKad = () => (isUnitymedia ? (lang === "en" ? WF_UY_EN : WF_UY) : (lang === "en" ? WF_KAD_EN : WF_KAD));
  const getWfKai = () => {
    if (form.o2) return lang === "en" ? WF_UY_O2_EN : WF_UY_O2;
    if (isUnitymedia) return lang === "en" ? WF_UY_EN : WF_UY;
    return lang === "en" ? WF_KAI_EN : WF_KAI;
  };
  const getTvKaa = () => (isUnitymedia ? (lang === "en" ? TV_UY_EN : TV_UY) : (lang === "en" ? TV_KAA_EN : TV_KAA));
  const getTvKad = () => (isUnitymedia ? (lang === "en" ? TV_UY_EN : TV_UY) : (lang === "en" ? TV_KAD_EN : TV_KAD));
  const getTvKai = () => (isUnitymedia ? (lang === "en" ? TV_UY_EN : TV_UY) : (lang === "en" ? TV_KAI_EN : TV_KAI));
  const getUep = () => (isUnitymedia ? UEP_ZUSTAND_UM : UEP_ZUSTAND_VKD);
  const getJaNein = () => (lang === "en" ? JA_NEIN_EN : JA_NEIN);
  const getJaNeinBeides = () => (lang === "en" ? JA_NEIN_BEIDES_EN : JA_NEIN_BEIDES);
  const getCoaxFiber = () => (lang === "en" ? COAX_FIBER_BEIDES_EN : COAX_FIBER_BEIDES);
  const getCcb1 = () => (lang === "en" ? CCB1_EN : CCB1);
  const getCcb2 = () => (lang === "en" ? CCB2_EN : CCB2);

  const handleSearch = useCallback(async () => {
    if (!form.environment || !form.company) return;
    setLoading(true);
    setSearched(true);

    const payload: Record<string, unknown> = {
      environment: form.environment,
      footprint: form.company,
      results: form.results || String(DEFAULT_MAX_ROWS),
      regions: form.regions,
    };
    if (form.o2) payload.o2 = "J";
    if (form.bewohnerPlus) payload.bewohnerPlus = "J";
    if (form.oxgFiber) payload.oxgFiber = "J";
    if (form.plz && form.plz.length === 5) payload.plz = form.plz;
    if (form.wfKaa) payload.wfKaa = form.wfKaa;
    if (form.wfKad) payload.wfKad = form.wfKad;
    if (form.wfKai) payload.wfKai = form.wfKai;
    if (form.selfinstall) payload.selfinstall = form.selfinstall;
    if (form.direktVersorgt) payload.direktVersorgt = form.direktVersorgt;
    if (form.maxWeVon) payload.maxWeVon = form.maxWeVon;
    if (form.maxWeBis) payload.maxWeBis = form.maxWeBis;
    if (form.dsVon) payload.dsVon = form.dsVon;
    if (form.dsBis) payload.dsBis = form.dsBis;
    if (form.usVon) payload.usVon = form.usVon;
    if (form.usBis) payload.usBis = form.usBis;
    if (form.docsis) payload.docsis = form.docsis;
    if (form.abk) payload.abk = form.abk;
    if (form.fttb) payload.fttb = form.fttb;
    if (form.ne4Status) payload.ne4Status = form.ne4Status;
    if (form.tvKaa) payload.tvKaa = form.tvKaa;
    if (form.tvKad) payload.tvKad = form.tvKad;
    if (form.tvKai) payload.tvKai = form.tvKai;
    if (form.uepZustand) payload.uepZustand = form.uepZustand;
    if (form.fiberStatus) payload.fiberStatus = form.fiberStatus;
    if (form.vertragsnummer) payload.vertragsnummer = form.vertragsnummer;
    if (form.kundennummer) payload.kundennummer = form.kundennummer;
    if (form.gestattungsvertrag) payload.gestattungsvertrag = form.gestattungsvertrag;
    if (form.anschlussvertrag) payload.anschlussvertrag = form.anschlussvertrag;
    if (form.salessegment) payload.salessegment = form.salessegment;
    if (form.vertragscodes.length > 0) payload.vertragscodes = form.vertragscodes;
    if (form.gs2Element) payload.gs2Element = form.gs2Element;
    if (form.bewohnerPlus) {
      payload.bpKaa = form.bpKaa;
      payload.bpKad = form.bpKad;
      payload.bpKai = form.bpKai;
    }

    try {
      const resp = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      setResults(data.results || []);
      setSqlQuery(data.sqlQuery || "");
      if (data.error) {
        setResults([{ OBJEKT_ID: "ERROR", ADRESSE: data.error, ONKZ: "-" }]);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setSqlQuery(`-- Fehler: ${msg}`);
      setResults([
        { OBJEKT_ID: "ERROR", ADRESSE: `Verbindungsfehler: ${msg}. Bitte prüfen Sie die VPN-Verbindung.`, ONKZ: "-" },
      ]);
    } finally {
      setLoading(false);
    }
  }, [form]);

  const handleRegionToggle = (region: string) => {
    const newRegions = form.regions.includes(region)
      ? form.regions.filter((r) => r !== region)
      : [...form.regions, region];
    updateField("regions", newRegions);
  };

  const handleAllRegions = () => {
    updateField("regions", form.regions.length === regions.length ? [] : [...regions]);
  };

  const handleInitialize = () => {
    initializeForm();
    setResults([]);
    setSqlQuery("");
    setSearched(false);
  };

  // Styles
  const ls: React.CSSProperties = { fontWeight: 600, padding: "4px 12px", width: "160px", fontSize: "14px", verticalAlign: "middle" };
  const cs: React.CSSProperties = { padding: "4px 8px", fontSize: "14px", verticalAlign: "middle" };
  const is: React.CSSProperties = { width: "250px", padding: "4px 8px", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px" };
  const isHalf: React.CSSProperties = { ...is, width: "110px" };

  const mamasUrl = form.environment ? MAMAS_CLIENT_URLS[form.environment] : undefined;
  const canSearch = !!form.environment && !!form.company && !loading;
  const plzActive = form.plz.length === 5;

  return (
    <div style={{ display: "flex", justifyContent: "center", minHeight: "100vh", backgroundColor: "#f5f5f5", padding: "16px 0" }}>
      <div style={{ width: "875px" }}>

        {/* ===== HEADER / NAVBAR ===== */}
        <nav
          style={{ backgroundColor: "#ffb3b3", width: "875px", padding: "8px 12px", position: "sticky", top: 0, zIndex: 100, borderRadius: "4px 4px 0 0" }}
          title="This page is optimized for browsers with Chromium engine."
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td rowSpan={2} style={{ width: "310px" }}>
                  <img
                    src={IMAGES.logo}
                    alt="KRAKEN Logo"
                    id="kraken-logo"
                    width={301}
                    height={102}
                    style={{ cursor: "pointer" }}
                    onDoubleClick={() => setShowEasterEgg(!showEasterEgg)}
                  />
                </td>
                <td colSpan={2} style={{ textAlign: "right", verticalAlign: "top" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                    <img src={IMAGES.flagGermany} alt="DE" width={22} height={22} style={{ opacity: lang === "de" ? 1 : 0.45, transition: "opacity 0.2s" }} />
                    {/* Toggle slider */}
                    <div
                      role="switch"
                      aria-checked={lang === "en"}
                      tabIndex={0}
                      onClick={() => setLang(lang === "de" ? "en" : "de")}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setLang(lang === "de" ? "en" : "de"); } }}
                      style={{
                        width: "44px",
                        height: "22px",
                        borderRadius: "11px",
                        backgroundColor: lang === "en" ? "#0055a4" : "#cc0000",
                        position: "relative",
                        cursor: "pointer",
                        transition: "background-color 0.25s",
                        flexShrink: 0,
                        border: "2px solid rgba(0,0,0,0.15)",
                        boxSizing: "border-box",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "2px",
                          left: lang === "en" ? "22px" : "2px",
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          backgroundColor: "white",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                          transition: "left 0.25s",
                        }}
                      />
                    </div>
                    <img src={IMAGES.flagUK} alt="EN" width={22} height={22} style={{ opacity: lang === "en" ? 1 : 0.45, transition: "opacity 0.2s" }} />
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={2} style={{ textAlign: "right", verticalAlign: "bottom", paddingTop: "8px" }}>
                  {loading && (
                    <div style={{ textAlign: "center", marginBottom: "8px" }}>
                      <div style={{ width: "24px", height: "24px", border: "3px solid #28a745", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", display: "inline-block" }} />
                    </div>
                  )}
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "center", flexWrap: "wrap" }}>
                    {mamasUrl && (
                      <a href={mamasUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#333", textDecoration: "underline" }}>
                        MAMAS
                      </a>
                    )}
                    <a href="/api-docs" style={{ fontSize: "12px", color: "#333", textDecoration: "underline" }}>
                      API
                    </a>
                    <button
                      id="btn-search"
                      onClick={handleSearch}
                      disabled={!canSearch}
                      style={{
                        backgroundColor: "#28a745", color: "white", border: "none",
                        padding: "6px 16px", borderRadius: "4px", fontSize: "14px", fontWeight: 500,
                        cursor: canSearch ? "pointer" : "not-allowed",
                        opacity: canSearch ? 1 : 0.6,
                      }}
                    >
                      {t.button1}
                    </button>
                    <button
                      id="btn-init"
                      onClick={handleInitialize}
                      style={{
                        backgroundColor: "#007bff", color: "white", border: "none",
                        padding: "6px 16px", borderRadius: "4px", fontSize: "14px", fontWeight: 500,
                      }}
                    >
                      {t.button2}
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <span style={{ fontSize: "10px", color: "#555" }}>Version: {VERSION}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </nav>

        {/* Easter Egg */}
        {showEasterEgg && (
          <div
            style={{ position: "fixed", zIndex: 1000, top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setShowEasterEgg(false)}
          >
            <img
              src={IMAGES.easterEgg}
              alt="Easter Egg"
              id="easter-egg-img"
              style={{ maxWidth: "875px", maxHeight: "80vh", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", borderRadius: "8px" }}
            />
          </div>
        )}

        {/* ===== PANEL: GRUNDEINSTELLUNG ===== */}
        <CollapsiblePanel title={t.head1} id="panel-grundeinstellung" defaultOpen={true}>
          <tr>
            <th style={ls} title={t.ttUmgebung}><label htmlFor="sel-environment">{t.labelUmgebung}</label></th>
            <td style={cs}>
              <KrakenSelect id="sel-environment" value={form.environment} options={ENVIRONMENTS} onChange={(v) => updateField("environment", v)} />
            </td>
            <th style={ls} title={t.ttFootprint}><label htmlFor="sel-footprint">Footprint</label></th>
            <td style={cs}>
              <KrakenSelect id="sel-footprint" value={form.company} options={FOOTPRINTS} onChange={(v) => { updateField("company", v); updateField("regions", []); }} />
            </td>
          </tr>

          {/* Regions + PLZ */}
          {form.company && (
            <tr>
              <th style={ls} title={t.ttRegion}><label>{t.labelRegion}</label></th>
              <td style={{ ...cs, paddingTop: "6px", paddingBottom: "6px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 12px", opacity: plzActive ? 0.5 : 1 }}>
                  {regions.map((r) => (
                    <label key={r} style={{ fontSize: "14px", cursor: plzActive ? "not-allowed" : "pointer" }}>
                      <input
                        type="checkbox"
                        id={`chk-region-${r}`}
                        checked={plzActive || form.regions.includes(r)}
                        onChange={() => handleRegionToggle(r)}
                        disabled={plzActive}
                        style={{ marginRight: "4px" }}
                      />
                      {r}
                    </label>
                  ))}
                  <label style={{ fontSize: "14px", cursor: plzActive ? "not-allowed" : "pointer" }}>
                    <input
                      type="checkbox"
                      id="chk-region-alle"
                      checked={plzActive || form.regions.length === regions.length}
                      onChange={handleAllRegions}
                      disabled={plzActive}
                      style={{ marginRight: "4px" }}
                    />
                    {lang === "en" ? "all" : "alle"}
                  </label>
                </div>
              </td>
              <th style={ls} title={lang === "en" ? "zip-code" : "Postleitzahl"}><label htmlFor="inp-plz">{t.labelPlz}</label></th>
              <td style={cs}>
                <input
                  type="text"
                  id="inp-plz"
                  value={form.plz}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                    updateField("plz", val);
                  }}
                  placeholder="z.B. 15344"
                  maxLength={5}
                  style={is}
                />
                {form.plz.length > 0 && form.plz.length < 5 && (
                  <span style={{ color: "red", fontSize: "11px", marginLeft: "6px" }}>
                    {lang === "en" ? "5 digits required" : "5 Ziffern erforderlich"}
                  </span>
                )}
              </td>
            </tr>
          )}

          {/* Results, O2, BewohnerPlus, OXG Fiber */}
          <tr>
            <th style={ls}><label htmlFor="inp-results">{t.labelResults}</label></th>
            <td style={cs}>
              <input
                type="number"
                id="inp-results"
                min={1}
                max={100}
                value={form.results}
                onChange={(e) => updateField("results", e.target.value)}
                placeholder={String(DEFAULT_MAX_ROWS)}
                style={is}
              />
            </td>
            <td style={cs} title={t.ttO2}>
              <label style={{ fontWeight: 700, marginRight: "6px" }}>O2</label>
              <input
                type="checkbox"
                id="chk-o2"
                checked={form.o2}
                onChange={(e) => { updateField("o2", e.target.checked); if (e.target.checked) { updateField("bewohnerPlus", false); updateField("oxgFiber", false); } }}
                disabled={form.bewohnerPlus || form.oxgFiber}
              />
            </td>
            <td style={cs}>
              <span title={t.ttBewohnerPlus}>
                <label style={{ fontWeight: 700, marginRight: "6px" }}>{t.labelBewohnerPlus}</label>
                <input
                  type="checkbox"
                  id="chk-bewohnerplus"
                  checked={form.bewohnerPlus}
                  onChange={(e) => { updateField("bewohnerPlus", e.target.checked); if (e.target.checked) { updateField("o2", false); updateField("oxgFiber", false); } }}
                  disabled={form.o2 || form.oxgFiber}
                />
              </span>
              <span style={{ marginLeft: "16px" }} title={t.labelOxgFiber}>
                <label style={{ fontWeight: 700, marginRight: "6px" }}>{t.labelOxgFiber}</label>
                <input
                  type="checkbox"
                  id="chk-oxgfiber"
                  checked={form.oxgFiber}
                  onChange={(e) => { updateField("oxgFiber", e.target.checked); if (e.target.checked) { updateField("o2", false); updateField("bewohnerPlus", false); } }}
                  disabled={form.o2 || form.bewohnerPlus}
                />
              </span>
            </td>
          </tr>
        </CollapsiblePanel>

        {/* ===== PANEL: WORKFLOW ===== */}
        {!form.oxgFiber && form.company && (
          <CollapsiblePanel title="Workflow" id="panel-workflow" defaultOpen={true}>
            {!form.o2 && (
              <tr>
                <th style={ls} title={t.ttKaa}><label htmlFor="sel-wf-kaa">KAA</label></th>
                <td style={cs}><ColorSelect id="sel-wf-kaa" value={form.wfKaa} options={getWfKaa()} onChange={(v) => updateField("wfKaa", v)} colorCoded placeholder={t.noSelection} /></td>
                <th style={ls} title={t.ttKad}><label htmlFor="sel-wf-kad">KAD</label></th>
                <td style={cs}><ColorSelect id="sel-wf-kad" value={form.wfKad} options={getWfKad()} onChange={(v) => updateField("wfKad", v)} colorCoded placeholder={t.noSelection} /></td>
              </tr>
            )}
            <tr>
              <th style={ls} title={t.ttKai}><label htmlFor="sel-wf-kai">KAI</label></th>
              <td style={cs}><ColorSelect id="sel-wf-kai" value={form.wfKai} options={getWfKai()} onChange={(v) => updateField("wfKai", v)} colorCoded placeholder={t.noSelection} /></td>
              <td colSpan={2} />
            </tr>
          </CollapsiblePanel>
        )}

        {/* ===== PANEL: TECHNISCHE PARAMETER ===== */}
        {!form.oxgFiber && form.company && (
          <CollapsiblePanel title={t.head3} id="panel-tech-params" defaultOpen={true}>
            <tr>
              <th style={ls} title={t.ttSelfinstall}><label htmlFor="sel-selfinstall">{t.labelSelfinstall}</label></th>
              <td style={cs}><KrakenSelect id="sel-selfinstall" value={form.selfinstall} options={getJaNein()} onChange={(v) => updateField("selfinstall", v)} /></td>
              {!isUnitymedia ? (
                <>
                  <th style={ls} title={t.ttDirektVersorgt}><label htmlFor="sel-direktversorgt">{t.labelDirektVersorgt}</label></th>
                  <td style={cs}><KrakenSelect id="sel-direktversorgt" value={form.direktVersorgt} options={getJaNeinBeides()} onChange={(v) => updateField("direktVersorgt", v)} /></td>
                </>
              ) : (
                <>
                  <th style={ls} title={t.ttMaxWe}><label>{t.labelMaxWe}</label></th>
                  <td style={cs}>
                    <input type="number" id="inp-maxwe-von" min={0} value={form.maxWeVon} onChange={(e) => updateField("maxWeVon", e.target.value)} placeholder={lang === "en" ? "from" : "von"} style={isHalf} />
                    <span style={{ margin: "0 4px" }}>-</span>
                    <input type="number" id="inp-maxwe-bis" min={0} value={form.maxWeBis} onChange={(e) => updateField("maxWeBis", e.target.value)} placeholder={lang === "en" ? "to" : "bis"} style={isHalf} />
                  </td>
                </>
              )}
            </tr>
            {!isUnitymedia && (
              <tr>
                <th style={ls} title={t.ttMaxWe}><label>{t.labelMaxWe}</label></th>
                <td style={cs}>
                  <input type="number" id="inp-maxwe-von-vkd" min={0} value={form.maxWeVon} onChange={(e) => updateField("maxWeVon", e.target.value)} placeholder={lang === "en" ? "from" : "von"} style={isHalf} />
                  <span style={{ margin: "0 4px" }}>-</span>
                  <input type="number" id="inp-maxwe-bis-vkd" min={0} value={form.maxWeBis} onChange={(e) => updateField("maxWeBis", e.target.value)} placeholder={lang === "en" ? "to" : "bis"} style={isHalf} />
                </td>
                <td colSpan={2} />
              </tr>
            )}
            <tr>
              <th style={ls} title={t.ttDsDatenrate}><label>{t.labelDS}</label></th>
              <td style={cs}>
                <input type="number" id="inp-ds-von" min={0} value={form.dsVon} onChange={(e) => updateField("dsVon", e.target.value)} placeholder={lang === "en" ? "from" : "von"} style={isHalf} />
                <span style={{ margin: "0 4px" }}>-</span>
                <input type="number" id="inp-ds-bis" min={0} value={form.dsBis} onChange={(e) => updateField("dsBis", e.target.value)} placeholder={lang === "en" ? "to" : "bis"} style={isHalf} />
              </td>
              <th style={ls} title={t.ttUsDatenrate}><label>{t.labelUS}</label></th>
              <td style={cs}>
                <input type="number" id="inp-us-von" min={0} value={form.usVon} onChange={(e) => updateField("usVon", e.target.value)} placeholder={lang === "en" ? "from" : "von"} style={isHalf} />
                <span style={{ margin: "0 4px" }}>-</span>
                <input type="number" id="inp-us-bis" min={0} value={form.usBis} onChange={(e) => updateField("usBis", e.target.value)} placeholder={lang === "en" ? "to" : "bis"} style={isHalf} />
              </td>
            </tr>
            <tr>
              <th style={ls} title={t.ttDocsis}><label htmlFor="sel-docsis">{t.labelDocsis}</label></th>
              <td style={cs}><KrakenSelect id="sel-docsis" value={form.docsis} options={DOCSIS} onChange={(v) => updateField("docsis", v)} /></td>
              <th style={ls} title={t.ttAbk}><label htmlFor="sel-abk">{t.labelAbk}</label></th>
              <td style={cs}><KrakenSelect id="sel-abk" value={form.abk} options={getJaNein()} onChange={(v) => updateField("abk", v)} /></td>
            </tr>
            <tr>
              <th style={ls}><label htmlFor="sel-fttb">{t.labelFttb}</label></th>
              <td style={cs}><KrakenSelect id="sel-fttb" value={form.fttb} options={getCoaxFiber()} onChange={(v) => updateField("fttb", v)} /></td>
              {isUnitymedia ? (
                <>
                  <th style={ls}><label htmlFor="sel-ne4status">{t.labelNe4Status}</label></th>
                  <td style={cs}><KrakenSelect id="sel-ne4status" value={form.ne4Status} options={UM_NE4_STATUS} onChange={(v) => updateField("ne4Status", v)} /></td>
                </>
              ) : <td colSpan={2} />}
            </tr>
          </CollapsiblePanel>
        )}

        {/* ===== PANEL: TECHNISCHE VERFÜGBARKEIT ===== */}
        {!form.oxgFiber && form.company && (
          <CollapsiblePanel title={t.head4} id="panel-tech-avail" defaultOpen={true}>
            {!form.o2 && (
              <tr>
                <th style={ls} title={t.ttKaa}><label htmlFor="sel-tv-kaa">KAA</label></th>
                <td style={cs}><KrakenSelect id="sel-tv-kaa" value={form.tvKaa} options={getTvKaa()} onChange={(v) => updateField("tvKaa", v)} /></td>
                <th style={ls} title={t.ttKad}><label htmlFor="sel-tv-kad">KAD</label></th>
                <td style={cs}><KrakenSelect id="sel-tv-kad" value={form.tvKad} options={getTvKad()} onChange={(v) => updateField("tvKad", v)} /></td>
              </tr>
            )}
            <tr>
              <th style={ls} title={t.ttKai}><label htmlFor="sel-tv-kai">KAI</label></th>
              <td style={cs}><KrakenSelect id="sel-tv-kai" value={form.tvKai} options={getTvKai()} onChange={(v) => updateField("tvKai", v)} /></td>
              <th style={ls} title={t.ttUepZustand}><label htmlFor="sel-uep">{t.labelUep}</label></th>
              <td style={cs}><KrakenSelect id="sel-uep" value={form.uepZustand} options={getUep()} onChange={(v) => updateField("uepZustand", v)} /></td>
            </tr>
          </CollapsiblePanel>
        )}

        {/* ===== PANEL: FIBER STATUS (OXG Fiber) ===== */}
        {form.oxgFiber && form.company && (
          <CollapsiblePanel title={t.labelFiberStatus} id="panel-fiber-status" defaultOpen={true}>
            <tr>
              <th style={ls}><label htmlFor="sel-fiber-status">{t.labelFiberStatus}</label></th>
              <td style={cs}><KrakenSelect id="sel-fiber-status" value={form.fiberStatus} options={FIBER_STATUS} onChange={(v) => updateField("fiberStatus", v)} /></td>
              <td colSpan={2} />
            </tr>
          </CollapsiblePanel>
        )}

        {/* ===== PANEL: VERTRAGSSITUATION (VKD) ===== */}
        {!form.oxgFiber && isVKD && (
          <CollapsiblePanel title={t.head5} id="panel-vertrag-vkd" defaultOpen={true}>
            <tr>
              <th style={ls}><label htmlFor="inp-vertragsnummer">{t.labelVertragsnummer}</label></th>
              <td style={cs}><input type="number" id="inp-vertragsnummer" min={0} max={999999999} value={form.vertragsnummer} onChange={(e) => updateField("vertragsnummer", e.target.value)} placeholder="*" style={is} /></td>
              <th style={ls}><label htmlFor="inp-kundennummer">{t.labelKundennummer}</label></th>
              <td style={cs}><input type="number" id="inp-kundennummer" min={0} max={999999999} value={form.kundennummer} onChange={(e) => updateField("kundennummer", e.target.value)} placeholder="*" style={is} /></td>
            </tr>
            <tr>
              <th style={ls}><label htmlFor="sel-gestattung">{t.labelGestattungsvertrag}</label></th>
              <td style={cs}><KrakenSelect id="sel-gestattung" value={form.gestattungsvertrag} options={getCcb1()} onChange={(v) => updateField("gestattungsvertrag", v)} /></td>
              <th style={ls}><label htmlFor="sel-anschluss">{t.labelAnschlussvertrag}</label></th>
              <td style={cs}><KrakenSelect id="sel-anschluss" value={form.anschlussvertrag} options={getCcb2()} onChange={(v) => updateField("anschlussvertrag", v)} /></td>
            </tr>
            <tr>
              <th style={ls}><label htmlFor="sel-salessegment">{t.labelSalessegment}</label></th>
              <td style={cs}><KrakenSelect id="sel-salessegment" value={form.salessegment} options={SALES_SEGMENT} onChange={(v) => updateField("salessegment", v)} /></td>
              <th style={ls}><label htmlFor="sel-vertragscode">{t.labelVertragscode}</label></th>
              <td style={cs}><MultiSelect id="sel-vertragscode" value={form.vertragscodes} options={CONTRACT_CODES} onChange={(v) => updateField("vertragscodes", v)} /></td>
            </tr>
          </CollapsiblePanel>
        )}

        {/* ===== PANEL: VERTRAGSSITUATION (UM) ===== */}
        {!form.oxgFiber && isUnitymedia && (
          <CollapsiblePanel title={t.head5} id="panel-vertrag-um" defaultOpen={true}>
            <tr>
              <th style={ls} title={t.ttGs2}><label htmlFor="sel-gs2">{t.labelGs2Element}</label></th>
              <td style={cs}><KrakenSelect id="sel-gs2" value={form.gs2Element} options={GS2_ELEMENT} onChange={(v) => updateField("gs2Element", v)} /></td>
              <td colSpan={2} />
            </tr>
          </CollapsiblePanel>
        )}

        {/* ===== PANEL: BEWOHNERPLUS ===== */}
        {form.bewohnerPlus && form.company && (
          <CollapsiblePanel title={t.labelBewohnerPlus} id="panel-bewohnerplus" defaultOpen={true}>
            <tr>
              {!isUnitymedia ? (
                <>
                  <th style={ls}>KAA</th>
                  <td style={cs}>
                    <label style={{ marginRight: "12px" }}>
                      <input type="radio" name="bp-kaa" value="J" checked={form.bpKaa === "J"} onChange={() => updateField("bpKaa", "J")} style={{ marginRight: "4px" }} />
                      {lang === "en" ? "Yes" : "Ja"}
                    </label>
                    <label>
                      <input type="radio" name="bp-kaa" value="N" checked={form.bpKaa === "N"} onChange={() => updateField("bpKaa", "N")} style={{ marginRight: "4px" }} />
                      {lang === "en" ? "No" : "Nein"}
                    </label>
                  </td>
                  <th style={ls}>KAD</th>
                  <td style={cs}>
                    <label style={{ marginRight: "12px" }}>
                      <input type="radio" name="bp-kad" value="J" checked={form.bpKad === "J"} onChange={() => updateField("bpKad", "J")} style={{ marginRight: "4px" }} />
                      {lang === "en" ? "Yes" : "Ja"}
                    </label>
                    <label>
                      <input type="radio" name="bp-kad" value="N" checked={form.bpKad === "N"} onChange={() => updateField("bpKad", "N")} style={{ marginRight: "4px" }} />
                      {lang === "en" ? "No" : "Nein"}
                    </label>
                  </td>
                </>
              ) : (
                <>
                  <th style={ls}>{t.labelBewohnerPlus}</th>
                  <td style={cs}>
                    <label style={{ marginRight: "12px" }}>
                      <input type="radio" name="bp-um" value="J" checked={form.bpKaa === "J"} onChange={() => updateField("bpKaa", "J")} style={{ marginRight: "4px" }} />
                      {lang === "en" ? "Yes" : "Ja"}
                    </label>
                    <label>
                      <input type="radio" name="bp-um" value="N" checked={form.bpKaa === "N"} onChange={() => updateField("bpKaa", "N")} style={{ marginRight: "4px" }} />
                      {lang === "en" ? "No" : "Nein"}
                    </label>
                  </td>
                  <td colSpan={2} />
                </>
              )}
            </tr>
            {!isUnitymedia && (
              <tr>
                <th style={ls}>KAI</th>
                <td style={cs}>
                  <label style={{ marginRight: "12px" }}>
                    <input type="radio" name="bp-kai" value="J" checked={form.bpKai === "J"} onChange={() => updateField("bpKai", "J")} style={{ marginRight: "4px" }} />
                    {lang === "en" ? "Yes" : "Ja"}
                  </label>
                  <label>
                    <input type="radio" name="bp-kai" value="N" checked={form.bpKai === "N"} onChange={() => updateField("bpKai", "N")} style={{ marginRight: "4px" }} />
                    {lang === "en" ? "No" : "Nein"}
                  </label>
                </td>
                <td colSpan={2} />
              </tr>
            )}
          </CollapsiblePanel>
        )}

        {/* ===== ERGEBNISTABELLE ===== */}
        {searched && (
          <>
            <input type="hidden" id="hidden-sql-query" value={sqlQuery} />

            <table style={{ width: "875px", borderCollapse: "collapse", marginTop: "8px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: "14px", fontWeight: 600 }}>{t.tHeadId}</th>
                  {isUnitymedia && <th style={{ padding: "8px 12px", textAlign: "left", fontSize: "14px", fontWeight: 600 }}>{t.tHeadUmId}</th>}
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: "14px", fontWeight: 600 }}>{t.tHeadAdr}</th>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: "14px", fontWeight: 600 }}>{t.tHeadOnkz}</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 && !loading && (
                  <tr>
                    <td colSpan={isUnitymedia ? 4 : 3} style={{ padding: "12px", textAlign: "center", color: "#666" }}>
                      {t.noResult}
                    </td>
                  </tr>
                )}
                {results.map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: row.OBJEKT_ID === "ERROR" ? "#fff3cd" : "#d4edda", borderBottom: "1px solid #dee2e6" }}>
                    <td style={{ padding: "6px 12px", fontSize: "14px" }}>{row.OBJEKT_ID}</td>
                    {isUnitymedia && <td style={{ padding: "6px 12px", fontSize: "14px" }}>{row.UM_ADRESSE_ID || ""}</td>}
                    <td style={{ padding: "6px 12px", fontSize: "14px" }}>{row.ADRESSE}</td>
                    <td style={{ padding: "6px 12px", fontSize: "14px" }}>{row.ONKZ || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Loading indicator */}
        {loading && (
          <div style={{ textAlign: "center", padding: "24px" }}>
            <img src={IMAGES.spinner} alt="Loading..." width={32} height={32} />
            <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
              {lang === "en" ? "Searching..." : "Suche läuft..."}
            </p>
          </div>
        )}

        {/* Footer spacer */}
        <div style={{ height: "40px" }} />
      </div>
    </div>
  );
}
