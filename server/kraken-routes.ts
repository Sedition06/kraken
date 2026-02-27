/**
 * Kraken API Routes
 * 
 * Provides Express routes for:
 * - POST /api/search  → GUI search (form submission)
 * - GET  /api/kraken  → External API access (query params)
 * - GET  /api/health  → Health check
 */
import { Router, type Request, type Response } from "express";
import { searchAddresses, type SearchResponse } from "./kraken-service";
import type { UmSearchParams } from "./query-builder-um";

export const krakenRouter = Router();

/**
 * POST /api/search
 * Used by the frontend GUI to search for test addresses.
 */
krakenRouter.post("/api/search", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    
    if (!body.environment || !body.footprint) {
      res.status(400).json({
        results: [],
        sqlQuery: "",
        count: 0,
        error: "Umgebung und Footprint sind Pflichtfelder.",
      });
      return;
    }
    
    const params = mapRequestToParams(body);
    const response = await searchAddresses(params);
    
    res.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Kraken API] /api/search error:", message);
    res.status(500).json({
      results: [],
      sqlQuery: "",
      count: 0,
      error: `Serverfehler: ${message}`,
    });
  }
});

/**
 * GET /api/kraken
 * External API for programmatic access (used by other tools).
 * Parameters are passed as query strings.
 * 
 * Example:
 *   /api/kraken?environment=GIT&footprint=Vodafone+Kabel&results=5&wfKaa=B&regions=R01,R02
 */
krakenRouter.get("/api/kraken", async (req: Request, res: Response) => {
  try {
    const query = req.query;
    
    if (!query.environment || !query.footprint) {
      res.status(400).json({
        results: [],
        sqlQuery: "",
        count: 0,
        error: "Parameters 'environment' and 'footprint' are required.",
      });
      return;
    }
    
    const params = mapQueryToParams(query);
    const response = await searchAddresses(params);
    
    res.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Kraken API] /api/kraken error:", message);
    res.status(500).json({
      results: [],
      sqlQuery: "",
      count: 0,
      error: `Server error: ${message}`,
    });
  }
});

/**
 * GET /api/health
 * Simple health check endpoint.
 */
krakenRouter.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "kraken",
    timestamp: new Date().toISOString(),
  });
});

// ─── Parameter mapping helpers ───

/**
 * Map POST body (from frontend) to search params.
 */
function mapRequestToParams(body: Record<string, any>): UmSearchParams {
  return {
    environment: body.environment,
    footprint: body.footprint,
    results: body.results || "10",
    regions: Array.isArray(body.regions) ? body.regions : [],
    plz: body.plz || undefined,
    o2: body.o2 === true || body.o2 === "J",
    bewohnerPlus: body.bewohnerPlus === true || body.bewohnerPlus === "J",
    oxgFiber: body.oxgFiber === true || body.oxgFiber === "J",
    // Workflow
    wfKaa: body.wfKaa || undefined,
    wfKad: body.wfKad || undefined,
    wfKai: body.wfKai || undefined,
    // Technische Parameter
    selfinstall: body.selfinstall || undefined,
    direktVersorgt: body.direktVersorgt || undefined,
    maxWeVon: body.maxWeVon || undefined,
    maxWeBis: body.maxWeBis || undefined,
    dsVon: body.dsVon || undefined,
    dsBis: body.dsBis || undefined,
    usVon: body.usVon || undefined,
    usBis: body.usBis || undefined,
    docsis: body.docsis || undefined,
    abk: body.abk || undefined,
    fttb: body.fttb || undefined,
    ne4Status: body.ne4Status || undefined,
    // Technische Verfügbarkeit
    tvKaa: body.tvKaa || undefined,
    tvKad: body.tvKad || undefined,
    tvKai: body.tvKai || undefined,
    uepZustand: body.uepZustand || undefined,
    // Fiber
    fiberStatus: body.fiberStatus || undefined,
    // Vertragssituation
    vertragsnummer: body.vertragsnummer || undefined,
    kundennummer: body.kundennummer || undefined,
    gestattungsvertrag: body.gestattungsvertrag || undefined,
    anschlussvertrag: body.anschlussvertrag || undefined,
    salessegment: body.salessegment || undefined,
    vertragscodes: Array.isArray(body.vertragscodes) ? body.vertragscodes : [],
    gs2Element: body.gs2Element || undefined,
    // BewohnerPlus
    bpKaa: body.bpKaa || undefined,
    bpKad: body.bpKad || undefined,
    bpKai: body.bpKai || undefined,
  };
}

/**
 * Map GET query params (from external API) to search params.
 */
function mapQueryToParams(query: Record<string, any>): UmSearchParams {
  // Regions can be comma-separated: regions=R01,R02,R03
  let regions: string[] = [];
  if (query.regions) {
    regions = String(query.regions).split(",").map(r => r.trim());
  }
  
  // Contract codes can be comma-separated
  let vertragscodes: string[] = [];
  if (query.vertragscodes) {
    vertragscodes = String(query.vertragscodes).split(",").map(c => c.trim());
  }
  
  return {
    environment: String(query.environment),
    footprint: String(query.footprint),
    results: query.results ? String(query.results) : "10",
    regions,
    plz: query.plz ? String(query.plz) : undefined,
    o2: query.o2 === "J" || query.o2 === "true",
    bewohnerPlus: query.bewohnerPlus === "J" || query.bewohnerPlus === "true",
    oxgFiber: query.oxgFiber === "J" || query.oxgFiber === "true",
    wfKaa: query.wfKaa ? String(query.wfKaa) : undefined,
    wfKad: query.wfKad ? String(query.wfKad) : undefined,
    wfKai: query.wfKai ? String(query.wfKai) : undefined,
    selfinstall: query.selfinstall ? String(query.selfinstall) : undefined,
    direktVersorgt: query.direktVersorgt ? String(query.direktVersorgt) : undefined,
    maxWeVon: query.maxWeVon ? String(query.maxWeVon) : undefined,
    maxWeBis: query.maxWeBis ? String(query.maxWeBis) : undefined,
    dsVon: query.dsVon ? String(query.dsVon) : undefined,
    dsBis: query.dsBis ? String(query.dsBis) : undefined,
    usVon: query.usVon ? String(query.usVon) : undefined,
    usBis: query.usBis ? String(query.usBis) : undefined,
    docsis: query.docsis ? String(query.docsis) : undefined,
    abk: query.abk ? String(query.abk) : undefined,
    fttb: query.fttb ? String(query.fttb) : undefined,
    ne4Status: query.ne4Status ? String(query.ne4Status) : undefined,
    tvKaa: query.tvKaa ? String(query.tvKaa) : undefined,
    tvKad: query.tvKad ? String(query.tvKad) : undefined,
    tvKai: query.tvKai ? String(query.tvKai) : undefined,
    uepZustand: query.uepZustand ? String(query.uepZustand) : undefined,
    fiberStatus: query.fiberStatus ? String(query.fiberStatus) : undefined,
    vertragsnummer: query.vertragsnummer ? String(query.vertragsnummer) : undefined,
    kundennummer: query.kundennummer ? String(query.kundennummer) : undefined,
    gestattungsvertrag: query.gestattungsvertrag ? String(query.gestattungsvertrag) : undefined,
    anschlussvertrag: query.anschlussvertrag ? String(query.anschlussvertrag) : undefined,
    salessegment: query.salessegment ? String(query.salessegment) : undefined,
    vertragscodes,
    gs2Element: query.gs2Element ? String(query.gs2Element) : undefined,
    bpKaa: query.bpKaa ? String(query.bpKaa) : undefined,
    bpKad: query.bpKad ? String(query.bpKad) : undefined,
    bpKai: query.bpKai ? String(query.bpKai) : undefined,
  };
}
