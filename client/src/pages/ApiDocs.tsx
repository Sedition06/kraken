import { useLanguage } from "@/contexts/LanguageContext";
import { IMAGES, VERSION } from "@/lib/config";

export default function ApiDocs() {
  const { lang } = useLanguage();

  const apiBase = window.location.origin;

  return (
    <div style={{ display: "flex", justifyContent: "center", minHeight: "100vh", backgroundColor: "#f5f5f5", padding: "16px 0" }}>
      <div style={{ width: "875px" }}>
        {/* Header */}
        <nav style={{ backgroundColor: "#ffb3b3", padding: "12px 16px", borderRadius: "4px 4px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <a href="/">
                <img src={IMAGES.logo} alt="KRAKEN Logo" height={60} />
              </a>
              <h1 style={{ fontSize: "20px", fontWeight: 600, margin: 0 }}>KRAKEN API Documentation</h1>
            </div>
            <div>
              <a href="/" style={{ fontSize: "14px", color: "#333", textDecoration: "underline" }}>
                ← {lang === "en" ? "Back to KRAKEN" : "Zurück zum KRAKEN"}
              </a>
            </div>
          </div>
          <span style={{ fontSize: "10px", color: "#555" }}>Version: {VERSION}</span>
        </nav>

        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "0 0 4px 4px", border: "1px solid #dee2e6" }}>
          <h2 style={{ fontSize: "18px", borderBottom: "2px solid #ffb3b3", paddingBottom: "8px" }}>Overview</h2>
          <p style={{ fontSize: "14px", lineHeight: 1.6 }}>
            The KRAKEN API allows you to search for test addresses programmatically. It supports the same search parameters as the GUI.
          </p>

          <h3 style={{ fontSize: "16px", marginTop: "24px" }}>Endpoints</h3>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", marginTop: "8px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8d7da" }}>
                <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #dee2e6" }}>Method</th>
                <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #dee2e6" }}>URI</th>
                <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #dee2e6" }}>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "8px 12px", border: "1px solid #dee2e6" }}><code>GET</code></td>
                <td style={{ padding: "8px 12px", border: "1px solid #dee2e6" }}><code>/api</code></td>
                <td style={{ padding: "8px 12px", border: "1px solid #dee2e6" }}>API documentation (this page as JSON)</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 12px", border: "1px solid #dee2e6" }}><code>POST</code></td>
                <td style={{ padding: "8px 12px", border: "1px solid #dee2e6" }}><code>/api/search</code></td>
                <td style={{ padding: "8px 12px", border: "1px solid #dee2e6" }}>Search for test addresses with JSON body</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 12px", border: "1px solid #dee2e6" }}><code>GET</code></td>
                <td style={{ padding: "8px 12px", border: "1px solid #dee2e6" }}><code>/api/search?...</code></td>
                <td style={{ padding: "8px 12px", border: "1px solid #dee2e6" }}>Search for test addresses with query parameters</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ fontSize: "16px", marginTop: "24px" }}>Parameters</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", marginTop: "8px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8d7da" }}>
                <th style={{ padding: "6px 10px", textAlign: "left", border: "1px solid #dee2e6" }}>Parameter</th>
                <th style={{ padding: "6px 10px", textAlign: "left", border: "1px solid #dee2e6" }}>Type</th>
                <th style={{ padding: "6px 10px", textAlign: "left", border: "1px solid #dee2e6" }}>Required</th>
                <th style={{ padding: "6px 10px", textAlign: "left", border: "1px solid #dee2e6" }}>Values</th>
                <th style={{ padding: "6px 10px", textAlign: "left", border: "1px solid #dee2e6" }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["environment", "string", "YES", "GIT, PNA, 3.TEST, 4.TEST", "Test environment"],
                ["footprint", "string", "YES", "Vodafone Kabel, Unitymedia", "Footprint selection"],
                ["results", "number", "NO", "1-100 (default: 10)", "Number of results"],
                ["regions", "string[]", "NO", "VKD: R01,R02,R03,R04,R07,R09 / UM: R05,R06,R08", "Region filter(s)"],
                ["o2", "string", "NO", "J / N", "O2 Wholesale Flag"],
                ["bewohnerPlus", "string", "NO", "J / N", "BewohnerPlus (tenant bonus)"],
                ["oxgFiber", "string", "NO", "J / N", "OXG Fiber flag"],
                ["plz", "string", "NO", "5-digit German ZIP", "Postal code search (new)"],
                ["wfKaa", "string", "NO", "A, B, I, V", "Workflow KAA"],
                ["wfKad", "string", "NO", "A, B, I, V", "Workflow KAD"],
                ["wfKai", "string", "NO", "A, B, I, V, C, Y, S", "Workflow KAI"],
                ["selfinstall", "string", "NO", "J / N", "SelfInstall available"],
                ["direktVersorgt", "string", "NO", "J / N / *", "Directly supplied"],
                ["maxWeVon", "number", "NO", "0-999", "Max residential units (from)"],
                ["maxWeBis", "number", "NO", "0-999", "Max residential units (to)"],
                ["dsVon", "number", "NO", "0-9999", "DS data rate from (Mbit/s)"],
                ["dsBis", "number", "NO", "0-9999", "DS data rate to (Mbit/s)"],
                ["usVon", "number", "NO", "0-9999", "US data rate from (Mbit/s)"],
                ["usBis", "number", "NO", "0-9999", "US data rate to (Mbit/s)"],
                ["docsis", "string", "NO", "3.0, 3.1", "DOCSIS version"],
                ["abk", "string", "NO", "J / N", "ABK flag"],
                ["fttb", "string", "NO", "C / F", "FTTB (Coax/Fiber)"],
                ["tvKaa", "string", "NO", "J, N, KV", "Technical availability KAA"],
                ["tvKad", "string", "NO", "J, N, KV", "Technical availability KAD"],
                ["tvKai", "string", "NO", "NV, KV, PL3, PL4, TV3, TV4, TV5", "Technical availability KAI"],
                ["uepZustand", "string", "NO", "0-8", "NDP state"],
                ["vertragsnummer", "string", "NO", "numeric", "Contract number"],
                ["kundennummer", "string", "NO", "numeric", "Customer number"],
                ["gestattungsvertrag", "string", "NO", "0, A, B, C", "Permission contract"],
                ["anschlussvertrag", "string", "NO", "0, A-L", "Access contract"],
                ["salessegment", "string", "NO", "GK_, KMU, PKV, SMB, WS_, VDF", "Sales segment"],
                ["vertragscodes", "string[]", "NO", "see contract code list", "Contract codes (multiple)"],
                ["gs2Element", "string", "NO", "see GS2 list", "GS2 Element (UM only)"],
                ["showSql", "boolean", "NO", "true / false (default: false)", "Include SQL queries in response"],
              ].map(([param, type, req, values, desc], idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#f9f9f9" }}>
                  <td style={{ padding: "4px 10px", border: "1px solid #dee2e6", fontFamily: "monospace" }}>{param}</td>
                  <td style={{ padding: "4px 10px", border: "1px solid #dee2e6" }}>{type}</td>
                  <td style={{ padding: "4px 10px", border: "1px solid #dee2e6", fontWeight: req === "YES" ? 700 : 400, color: req === "YES" ? "#c00" : "#333" }}>{req}</td>
                  <td style={{ padding: "4px 10px", border: "1px solid #dee2e6", fontSize: "12px" }}>{values}</td>
                  <td style={{ padding: "4px 10px", border: "1px solid #dee2e6" }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ fontSize: "16px", marginTop: "24px" }}>Example Requests</h3>

          <h4 style={{ fontSize: "14px", marginTop: "16px" }}>POST Request</h4>
          <pre style={{ backgroundColor: "#2d2d2d", color: "#f8f8f2", padding: "16px", borderRadius: "4px", fontSize: "13px", overflow: "auto" }}>
{`POST ${apiBase}/api/search
Content-Type: application/json

{
  "environment": "GIT",
  "footprint": "Vodafone Kabel",
  "results": 5,
  "regions": ["R01", "R04"],
  "wfKai": "B",
  "dsVon": 100,
  "dsBis": 500
}`}
          </pre>

          <h4 style={{ fontSize: "14px", marginTop: "16px" }}>GET Request</h4>
          <pre style={{ backgroundColor: "#2d2d2d", color: "#f8f8f2", padding: "16px", borderRadius: "4px", fontSize: "13px", overflow: "auto" }}>
{`GET ${apiBase}/api/search?environment=GIT&footprint=Vodafone+Kabel&results=2&wfKai=B&showSql=true`}
          </pre>

          <h4 style={{ fontSize: "14px", marginTop: "16px" }}>PLZ Search (new feature)</h4>
          <pre style={{ backgroundColor: "#2d2d2d", color: "#f8f8f2", padding: "16px", borderRadius: "4px", fontSize: "13px", overflow: "auto" }}>
{`POST ${apiBase}/api/search
Content-Type: application/json

{
  "environment": "GIT",
  "footprint": "Vodafone Kabel",
  "results": 10,
  "plz": "15344"
}`}
          </pre>

          <h3 style={{ fontSize: "16px", marginTop: "24px" }}>Response Format</h3>
          <pre style={{ backgroundColor: "#2d2d2d", color: "#f8f8f2", padding: "16px", borderRadius: "4px", fontSize: "13px", overflow: "auto" }}>
{`{
  "results": [
    {
      "OBJEKT_ID": "123456",
      "ADRESSE": "12345 Berlin, Musterstr. 1",
      "ONKZ": "030",
      "UM_ADRESSE_ID": null
    }
  ],
  "count": 1,
  "sqlQuery": "SELECT ... (only if showSql=true)"
}`}
          </pre>

          <h3 style={{ fontSize: "16px", marginTop: "24px" }}>Error Response</h3>
          <pre style={{ backgroundColor: "#2d2d2d", color: "#f8f8f2", padding: "16px", borderRadius: "4px", fontSize: "13px", overflow: "auto" }}>
{`{
  "error": "A DB-ERROR occurred! Please contact your admin!",
  "results": [
    {
      "OBJEKT_ID": "ERROR",
      "ADRESSE": "A DB-ERROR occurred! Please contact your admin!"
    }
  ]
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
