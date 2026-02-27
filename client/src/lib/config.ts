// Kraken Configuration - migrated from Config.groovy and ConfigEng.groovy

export const VERSION = "2025.04.14";

// CDN URLs for images
export const IMAGES = {
  logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663120008595/T4Ngy7vYUq2hGxvfZueYVw/logo_kraken2_12f8b777.png",
  easterEgg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663120008595/T4Ngy7vYUq2hGxvfZueYVw/ebc_s_r_6bc54e95.png",
  flagGermany: "https://d2xsxph8kpxj0f.cloudfront.net/310519663120008595/T4Ngy7vYUq2hGxvfZueYVw/flag_germany_d229f374.png",
  flagUK: "https://d2xsxph8kpxj0f.cloudfront.net/310519663120008595/T4Ngy7vYUq2hGxvfZueYVw/flag_united_kingdom_57cbf0ab.png",
  spinner: "https://d2xsxph8kpxj0f.cloudfront.net/310519663120008595/T4Ngy7vYUq2hGxvfZueYVw/spinner_9b632d89.gif",
};

// Environments
export const ENVIRONMENTS: Record<string, string> = {
  GIT: "GIT",
  PNA: "PNA",
  "3.TEST": "3.TEST",
  "4.TEST": "4.TEST",
};

// Footprints
export const FOOTPRINTS: Record<string, string> = {
  "Vodafone Kabel": "Vodafone Kabel",
  Unitymedia: "Unitymedia",
};

// Regions per footprint
export const REGIONS_VKD = ["R01", "R02", "R03", "R04", "R07", "R09"];
export const REGIONS_UM = ["R05", "R06", "R08"];

// Default max rows
export const DEFAULT_MAX_ROWS = 10;

// Workflow values
export const WF_KAA: Record<string, string> = { A: "Ablehnung", B: "Bestellung", I: "Interessent", V: "Vorvermarktung" };
export const WF_KAD: Record<string, string> = { A: "Ablehnung", B: "Bestellung", I: "Interessent", V: "Vorvermarktung" };
export const WF_KAI: Record<string, string> = { A: "Ablehnung", B: "Bestellung", I: "Interessent", V: "Vorvermarktung", C: "Bereitstellung unter Vorbehalt" };

export const WF_UY_KAA: Record<string, string> = { A: "Ablehnung", B: "Bestellung", V: "Vorvermarktung" };
export const WF_UY: Record<string, string> = { A: "Ablehnung", B: "Bestellung" };
export const WF_UY_O2: Record<string, string> = { A: "Ablehnung", B: "Bestellung", Y: "Gestattung", S: "Überlastung" };

// Technical availability
export const TV_KAA: Record<string, string> = { J: "Ja", N: "Nein", KV: "kurzfristig verfügbar" };
export const TV_KAD: Record<string, string> = { J: "Ja", N: "Nein", KV: "kurzfristig verfügbar" };
export const TV_KAI: Record<string, string> = { NV: "NV - Nicht verfügbar", KV: "KV - Kurzfristig verfügbar", PL3: "PL3 - Geplant NE3", PL4: "PL4 - Geplant NE4", TV3: "TV3 - Verfügbar in NE3", TV4: "TV4 - Verfügbar in NE4", TV5: "TV5 - Verfügbar" };
export const TV_UY: Record<string, string> = { J: "Ja", N: "Nein" };

// ÜP-Zustand VKD
export const UEP_ZUSTAND_VKD: Record<string, string> = {
  "0": "0 - ÜP noch nicht geplant, Grundstück bereits erfasst",
  "1": "1 - ÜP geplant und die C-Linie nicht in Betrieb",
  "2": "2 - ÜP geplant und die C-Linie in Betrieb",
  "3": "3 - ÜP montiert, aber C-Linie nicht in Betrieb",
  "4": "4 - ÜP ist unverplombt betriebsbereit",
  "5": "5 - ÜP unverplombt betriebsbereit, zzt keine WE angemeldet",
  "6": "6 - ÜP verplombt, da zzt keine WE angemeldet",
  "7": "7 - ÜP betriebsbereit und angemeldet",
};

// ÜP-Zustand UM
export const UEP_ZUSTAND_UM: Record<string, string> = {
  "0": "0 - Status nicht mehr benutzt",
  "1": "1 - Cable was planned for the building",
  "2": "2 - physical cable on property",
  "3": "3 - Status nicht mehr benutzt",
  "4": "4 - ÜP ready for service available",
  "5": "5 - ÜP ready for service but currently no active customer",
  "6": "6 - like 5 but ÜP physical blocked",
  "7": "7 - ÜP ready for service and customer active",
  "8": "8 - Status nicht mehr benutzt",
};

// DOCSIS
export const DOCSIS: Record<string, string> = { "3.0": "3.0", "3.1": "3.1" };

// UM NE4 Status
export const UM_NE4_STATUS: Record<string, string> = {
  A: "A - NE4-Ausbauzustand nicht bekannt TK",
  B: "B - RK-fähiger HVr; Objekt nicht vollständig umgerüstet SI",
  C: "C - Ausbau beendet:Jede WE Rk-fähig umgerüstet mit MMD 3-Loch SI",
  D: "D - Ausbau beendet:Jede WE Rk-fähig umgerüstet mit MMD Wisi SI",
  E: "E - Objekt Rk-fähig ausgebaut mit 862 MHz ohne MMD TK",
  F: "F - Ausbau beendet:Jede WE Rk-fähig umgerüstet mit MMD 4-Loch SI",
  G: "G - Sat-Zusatz am ÜP; Breitband ggf. möglich TK",
  H: "H - Sat-Zusatz am ÜP; Breitband möglich TK",
  I: "I - Objekt kompl., 862 MHz o. Dose und Filter SI",
  J: "J - Objekt teilausb., 862 MHz o. Dose und Filter SI",
  K: "K - Objekt Einzel, 862 MHz o. Dose und Filter TK",
  M: "M - Sat-Nutzung der NE4; Breitband ggf. möglich TK",
  N: "N - Sat-Nutzung der NE4; Breitband möglich TK",
  O: "O - NE4 mit Querverkabelung durch LWL, BB nicht möglich",
  R: "R - Marode HVA; BB und DTV ohne Vollausbau nicht möglich",
  S: "S - Marode HVA, DTV eingeschränkt",
  T: "T - NE4-Ausbau nicht möglich/vorhanden",
  U: "U - Sat-Zusatz am ÜP; Breitband nicht möglich",
  V: "V - 450 MHz Tech; DTV eingeschr.",
  W: "W - Objekt komplett ausgebaut mit 862 MHz ohne Rk und MMD",
  X: "X - Nach Umbau jede WE Rk-fähig TK",
  Y: "Y - Sat-Nutzung der NE4; keine Dienste möglich",
  Z: "Z - Sat-Zusatz am ÜP; keine Dienste möglich",
  "0": "0 - ungültige Adresse",
  "2": "2 - Ausbau beendet:mehrere 3 Loch MMDs + passiver Fiber SI",
  "3": "3 - Ausbau beendet:3-Loch MMD + passiver Fiber SI",
  "4": "4 - Ausbau beendet:4-Loch MMD + passiver Fiber SI",
  "5": "5 - Ausbau beendet:3-Loch WisiClik + passiver Fiber SI",
  "6": "6 - Ausbau beendet:4-Loch Homeway + passiver Fiber TK",
  "7": "7 - Ausbau beendet:2-Loch Homeway + passiver Fiber TK",
  "8": "8 - Jede WE im Objekt rückkanalfähig, nicht vollständig umgerüstet",
  "9": "9 - Jede WE im Objekt rückkanalfähig umgerüstet mit 2-Loch MMD",
};

// Vertragssituation
export const SALES_SEGMENT: Record<string, string> = { GK_: "GK_", KMU: "KMU", PKV: "PKV", SMB: "SMB", WS_: "WS_", VDF: "VDF" };

export const CCB1: Record<string, string> = {
  "0": "Kein Gestattungsvertrag vorhanden",
  A: "MMG vorhanden",
  B: "STL / STD vorhanden",
  C: "MMI vorhanden",
};

export const CCB2: Record<string, string> = {
  "0": "Kein Anschlussvertrag vorhanden",
  A: "MNV-Wohnung vorhanden",
  B: "Kein MNV aber 'ENV – Haus' vorhanden",
  C: "VV vorhanden",
  D: "'MNV – Haus' am Haus vorhanden",
  E: "'MNV-Haus' mit MMG vorhanden",
  F: "MNV-Wohnung Basis (ZIB)",
  K: "Durchleiter vorhanden",
  L: "'MNV-Haus' Internet am Haus vorhanden",
};

// Fiber Status
export const FIBER_STATUS: Record<string, string> = {
  "1": "1 - notPlanned",
  "2": "2 - areaPlanned",
  "3": "3 - preMarketing",
  "4": "4 - underConstruction",
  "5": "5 - homesPassed",
  "6": "6 - homesPassedPlus",
  "7": "7 - homesPrepared",
  "8": "8 - homesReady",
  "9": "9 - homesConnected",
};

// Ja/Nein/Beides
export const JA_NEIN_BEIDES: Record<string, string> = { J: "Ja", N: "Nein", "*": "Beides" };
export const JA_NEIN: Record<string, string> = { J: "Ja", N: "Nein" };
export const COAX_FIBER_BEIDES: Record<string, string> = { C: "Coax", F: "Fiber", "*": "Beides" };

// Contract codes (large list from Config.groovy)
export const CONTRACT_CODES: Record<string, string> = {
  MIT: "MIT - Mitnutzung", WBA: "WBA - Paket Internet/Phone", ZIK: "ZIK - Zentralinkasso",
  "405": "405 - NE4 5 Jahre", "410": "410 - NE4 10Jahre", "415": "415 - NE4 15Jahre",
  MOW: "MOW - Kabelanschluss Wohnung", WOA: "WOA", MDW: "MDW", MHD: "MHD - MNV-Wohnung Digital HD",
  WOD: "WOD", WHD: "WHD - MNV-Wohnung Digital HD", WGA: "WGA - Kabelanschluss Wohnung Gewerbliche WE 1:5",
  WGD: "WGD - Kabelanschluss Wohnung Gewerbliche WE 1:5 digital", GHD: "GHD - MNV-Wohnung Digital HD",
  M28: "M28", "28D": "28D", "8HD": "8HD - MNV-Wohnung digital mit 128k",
  M2D: "M2D - MNV-Whg. dig. 128k mit Durchschnittspreis, Premium",
  M51: "M51 - MNV Wohnung analog mit 512k vorhanden", "51D": "51D - MNV Wohnung digital mit 512k vorhanden",
  "5HD": "5HD - MNV Wohnung digital HD mit 512k vorhanden",
  MAF: "MAF - Medienanschluss Familie", VVO: "VVO - Versorgungsvereinb.",
  VVE: "VVE", VDP: "VDP", VHP: "VHP - Digitale HD VVO Premium",
  VDE: "VDE", VHE: "VHE - Digitale HD VVO Express", ZIB: "ZIB - Zentralinkasso Basis",
  "3MD": "3MD - NE3 Vertrag mit MMG und Durchleiter", HDK: "HDK - MNV-Haus Digital HD - Durchleiter",
  "3DD": "3DD - Kabelanschluss HausStandard mit MMG digital als Laufzeitvertrag mit Durchleiter",
  HDD: "HDD - MNV-Haus Digital HD - Durchleiter", MIN: "MIN - MNV Haus Internet",
  "3MI": "3MI - NE3-Vertrag mit MMG", "3ML": "3ML - NE3-Vertrag mit MMG",
  "3DM": "3DM - Kabelanschluss Haus-Standard mit MMG digital",
  HDS: "HDS - MNV-Haus Digital HD mit MMG",
  "3DL": "3DL - Kabelanschluss Haus-Standard mit MMG digital als Laufzeitvertrag",
  HDM: "HDM - MNV-Haus Digital HD mit MMG", AVO: "AVO - Anschlussv. Objekt",
  RDW: "RDW", RAV: "RAV - Rahmenvertrag", RAH: "RAH", INV: "INV - Mehrnutzervertrag",
  GKV: "GKV - GK Mehrnutzervertrag", "301": "301 - NE3 1 Jahr", "303": "303 - NE3 3 Jahre",
  "305": "305 - NE3 5 Jahre", "310": "310 - NE3 10 Jahre", MOH: "MOH - Kabelanschluss Haus",
  G5J: "G5J - Rahmenvertr. 5 Jahre", N3I: "N3I - NE3 Indirekt",
  HGA: "HGA - Kabelanschluss Haus Gewerbliche WE 1:5 analog",
  H28: "H28 - Kabelanschluss Haus mit 128K HSI",
  HGD: "HGD - Kabelanschluss Haus Gewerbliche WE 1:5 digital",
  HDG: "HDG - MNV-Haus digital HD",
  IND: "IND - Kabelanschluss Haus Standard ohne MMG digital",
  HD3: "HD3 - MNV-Haus Digital HD",
  D28: "D28 - Kabelanschluss Haus digital mit 128K HSI",
  HD8: "HD8 - MNV-Haus digital HD mit 128k",
  MDH: "MDH - Kabelanschluss HausStandard ohne MMG digital über Modularvertrag",
  HDO: "HDO - MNV-Haus Digital HD",
  H51: "H51 - MNV Haus analog mit 512k vorhanden",
  D51: "D51 - MNV Haus digital mit 512k vorhanden",
  HD5: "HD5 - MNV Haus digital HD mit 512k vorhanden",
  RVI: "RVI - Rahmenvertrag Internet", EVI: "EVI - Einzelnutzervertrag",
  "4M2": "4M2 - MMA ENV24", AN3: "AN3 - ENV", KMV: "KMV - Kabelmietvertrag",
  KMP: "KMP - Kabelmietv. Premium", ENA: "ENA - Einzelnutzer Alt",
  ENV: "ENV - Einzelnutzervertrag", EN2: "EN2 - ENV 1 Jahresvertrag",
  A24: "A24 - KAA24 MonateLaufzeit", "4K2": "4K2 - ENV 24 Monate",
  AD1: "AD1 - 12 Monate Laufzeit", N3D: "N3D - NE3 Direkt",
  A01: "A01 - Digitaler Kabelansch", A12: "A12", A15: "A15",
  TRA: "TRA", TRP: "TRP", W12: "W12 - Kabelanschluss Wohnung",
  BUN: "BUN - 3P Bundle Vertrag", MMG: "MMG - Multmedia Gestattung",
  STL: "STL - Serviceleistung NE3", STD: "STD - digitaler MNV Haus mit Service vorhanden",
  STV: "STV - Serviceleistung", SDV: "SDV - Serviceleistung",
  STH: "STH - Kabelanschluss Service HD", GEE: "GEE - Grundstückseigentümererklärung",
  MMI: "MMI - Internetgestattung Vodafone Enterprise",
  SFV: "SFV - Standardfestverbind.", KOP: "KOP - Kooperationsvertrag",
  BAU: "BAU - Baukosten", NSI: "NSI - Serv. Indirekte Kund",
  DMY: "DMY - DMS Vertrag", M18: "M18 - ÜP Nutzung Markt 18",
  WEX: "WEX - Werkvertrag Express", UBE: "UBE - Testsignal n.ÜP Bau",
  WCL: "WCL - Wervertrag Classic", SZF: "SZF - Zusatzauss. Sat-ZF",
  DIG: "DIG - Digi Kabel Endkunde", FIA: "FIA - Fast Internet Access",
  HSI: "HSI - Kabel Highspeed", AVW: "AVW - Anschlussvereinb. WE",
  D12: "D12 - Kabel Digital 12 Mo.", D24: "D24 - Kabel Digital 24 Mo.",
  D03: "D03 - Kabel Digital 3 Mo.", D15: "D15 - Kabel Digital 15 Mo.",
  T14: "T14 - Testabo Home 14 Tage", AD2: "AD2 - 24 Monate Laufzeit",
  VOP: "VOP - Kabel Phone", HP1: "HP1 - Kabel Phone+Internet",
  NSD: "NSD - Service Direkte Kund", VOD: "VOD - SELECT VIDEO",
  D02: "D02 - Kabel Digital 2 Mo.",
};

// GS2 Element (UM Vertragssituation) - abbreviated for readability
export const GS2_ELEMENT: Record<string, string> = {
  AB: "AB - CARRIER: REHNIG BAK MMA-1 MBIT",
  AK: "AK - CARRIER: PYUR (TCM - DTK) DKA",
  AL: "AL - ALTE LEIPZIGER LEBENSVERSICHERUNG",
  BA: "BA - CARRIER: MEDICOM AG",
  B2: "B2 - PON - MMA 1 MBIT VORVERMARKTUNG",
  B3: "B3 - PON - MMA 6 MBIT VORVERMARKTUNG",
  B4: "B4 - PON - MMA 10 MBIT VORVERMARKTUNG",
  B5: "B5 - PON - MMA 32 MBIT VORVERMARKTUNG",
  B6: "B6 - PON - AV VORVERMARKTUNG",
  B7: "B7 - PON - AV VORVERMARKTUNG INKL. SERVICE",
  "00": "00 - N/A",
  "17": "17 - PON - VERSORGUNGSVEREINBARUNG",
  "22": "22 - PON - MMA 1 MBIT",
  "50": "50 - PON - MMA 6 MBIT",
  "55": "55 - PON - MMA 10 MBIT",
  "60": "60 - PON - MMA 32 MBIT",
};

// ===== ENGLISH TRANSLATIONS =====

export const LABELS_DE = {
  head1: "Grundeinstellung",
  head3: "Technische Parameter",
  head4: "Technische Verfügbarkeit",
  head5: "Vertragssituation",
  button1: "Suchen",
  button2: "Initialisieren",
  noSelection: "auswählen...",
  labelUmgebung: "Umgebung",
  labelFootprint: "Footprint",
  labelRegion: "Region",
  labelResults: "Anz. Ergebnisse",
  labelO2: "O2",
  labelBewohnerPlus: "BewohnerPlus",
  labelOxgFiber: "OXG Fiber",
  labelSelfinstall: "SelfInstall",
  labelDirektVersorgt: "direkt Versorgt",
  labelMaxWe: "maxWE",
  labelDS: "DS Datenrate",
  labelUS: "US Datenrate",
  labelDocsis: "DOCSIS",
  labelAbk: "ABK",
  labelFttb: "FTTB",
  labelUep: "ÜP-Zustand",
  labelVertragsnummer: "Vertragsnummer",
  labelKundennummer: "Kundennummer",
  labelGestattungsvertrag: "Gestattungsvertrag",
  labelAnschlussvertrag: "Anschlussvertrag",
  labelSalessegment: "Salessegment",
  labelVertragscode: "Vertragscode",
  labelGs2Element: "GS2 Element",
  labelNe4Status: "NE4 Status",
  labelPlz: "PLZ",
  tHeadId: "VF AdresseID",
  tHeadUmId: "UM AdresseID",
  tHeadAdr: "Adresse",
  tHeadOnkz: "ONKZ",
  noResult: "keine Daten gefunden",
  labelFiberStatus: "Fiber Status",
  // Tooltips
  ttUmgebung: "Testumgebung auswählen",
  ttFootprint: "Footprint auswählen",
  ttRegion: "Region(en) auswählen",
  ttO2: "O2 Wholesale Flag",
  ttBewohnerPlus: "BewohnerPlus (Mieter-Bonus)",
  ttKaa: "Kabelanschluss Analog",
  ttKad: "Kabelanschluss Digital",
  ttKai: "Kabelanschluss Internet",
  ttSelfinstall: "SelfInstall verfügbar",
  ttDirektVersorgt: "Objekt direkt versorgt",
  ttMaxWe: "Maximale Wohneinheiten",
  ttDsDatenrate: "Downstream Datenrate in Mbit/s",
  ttUsDatenrate: "Upstream Datenrate in Mbit/s",
  ttDocsis: "DOCSIS Version",
  ttAbk: "Ausbaukoordination",
  ttUepZustand: "Übergabepunkt Zustand",
  ttGs2: "Gebäudesegment 2",
  ttPlz: "Postleitzahl",
  vonBis: "von - bis",
};

export const LABELS_EN: typeof LABELS_DE = {
  head1: "Basic settings",
  head3: "Technical parameters",
  head4: "Technical availability",
  head5: "Contract situation",
  button1: "Search",
  button2: "Initialize",
  noSelection: "choose...",
  labelUmgebung: "Environment",
  labelFootprint: "Footprint",
  labelRegion: "Region",
  labelResults: "No. of results",
  labelO2: "O2",
  labelBewohnerPlus: "TenantDiscount",
  labelOxgFiber: "OXG Fiber",
  labelSelfinstall: "SelfInstall",
  labelDirektVersorgt: "directly supplied",
  labelMaxWe: "maxRU",
  labelDS: "DS data rate",
  labelUS: "US data rate",
  labelDocsis: "DOCSIS",
  labelAbk: "ABK",
  labelFttb: "FTTB",
  labelUep: "NDP-State",
  labelVertragsnummer: "Contract number",
  labelKundennummer: "Customer number",
  labelGestattungsvertrag: "Permission contract",
  labelAnschlussvertrag: "Access contract",
  labelSalessegment: "Sales segment",
  labelVertragscode: "Contract code",
  labelGs2Element: "GS2 Element",
  labelNe4Status: "NE4 Status",
  labelPlz: "ZIP",
  tHeadId: "VF AddressID",
  tHeadUmId: "UM AddressID",
  tHeadAdr: "Address",
  tHeadOnkz: "ONKZ",
  noResult: "no data found",
  labelFiberStatus: "Fiber Status",
  ttUmgebung: "Select test environment",
  ttFootprint: "Select footprint",
  ttRegion: "Select region(s)",
  ttO2: "O2 Wholesale Flag",
  ttBewohnerPlus: "TenantDiscount (tenant bonus)",
  ttKaa: "Cable connection analog",
  ttKad: "Cable connection digital",
  ttKai: "Cable connection internet",
  ttSelfinstall: "SelfInstall available",
  ttDirektVersorgt: "Object directly supplied",
  ttMaxWe: "Maximum residential units",
  ttDsDatenrate: "Downstream data rate in Mbit/s",
  ttUsDatenrate: "Upstream data rate in Mbit/s",
  ttDocsis: "DOCSIS version",
  ttAbk: "Expansion coordination",
  ttUepZustand: "Network delivery point state",
  ttGs2: "Building segment 2",
  ttPlz: "zip-code",
  vonBis: "from - to",
};

// English workflow/TV values
export const WF_KAA_EN: Record<string, string> = { A: "Rejection", B: "Order", I: "Interest", V: "Premarketing" };
export const WF_KAD_EN: Record<string, string> = { A: "Rejection", B: "Order", I: "Interest", V: "Premarketing" };
export const WF_KAI_EN: Record<string, string> = { A: "Rejection", B: "Order", I: "Interest", V: "Premarketing", C: "Conditional Order" };
export const WF_UY_KAA_EN: Record<string, string> = { A: "Rejection", B: "Order", V: "Premarketing" };
export const WF_UY_EN: Record<string, string> = { A: "Rejection", B: "Order" };
export const WF_UY_O2_EN: Record<string, string> = { A: "Rejection", B: "Order", Y: "Permission", S: "Overload" };

export const TV_KAA_EN: Record<string, string> = { J: "Yes", N: "No", KV: "shortly available" };
export const TV_KAD_EN: Record<string, string> = { J: "Yes", N: "No", KV: "shortly available" };
export const TV_KAI_EN: Record<string, string> = { NV: "NV - not available", KV: "KV - shortly available", PL3: "PL3 - planned NE3", PL4: "PL4 - planned NE4", TV3: "TV3 - available in NE3", TV4: "TV4 - available in NE4", TV5: "TV5 - available" };
export const TV_UY_EN: Record<string, string> = { J: "Yes", N: "No" };

export const JA_NEIN_EN: Record<string, string> = { J: "Yes", N: "No" };
export const JA_NEIN_BEIDES_EN: Record<string, string> = { J: "Yes", N: "No", "*": "Both" };
export const COAX_FIBER_BEIDES_EN: Record<string, string> = { C: "Coax", F: "Fiber", "*": "Both" };

export const CCB1_EN: Record<string, string> = {
  "0": "No permission contract available",
  A: "MMG available",
  B: "STL / STD available",
  C: "MMI available",
};

export const CCB2_EN: Record<string, string> = {
  "0": "No access contract available",
  A: "MNV-Wohnung vorhanden",
  B: "No MNV but 'ENV – Haus' available",
  C: "VV available",
  D: "'MNV – Haus' contract available at the house",
  E: "'MNV-Haus' with MMG available",
  F: "MNV-Wohnung Basis (ZIB)",
  K: "Durchleiter available",
  L: "'MNV-Haus' Internet on building available",
};

// Workflow color mapping
export const WORKFLOW_COLORS: Record<string, string> = {
  A: "#ff0000",     // red - Ablehnung
  B: "#008000",     // green - Bestellung
  I: "#ffff00",     // yellow - Interessent
  V: "#00bfff",     // DeepSkyBlue - Vorvermarktung
  C: "#ffa500",     // orange - Bereitstellung unter Vorbehalt
  Y: "#ffff00",     // yellow - Gestattung
  S: "#90ee90",     // lightgreen - Überlastung
};

// DB Constants (from Config.groovy) - kept for reference/fallback
export const DB_CONSTANTS = {
  url_ple: "jdbc:oracle:thin:@almp-pub1.kabeldeutschland.de:1525:ALMP",
  user_ple: "QC_NGPLE",
  pw_ple: "QC_NGPLE.DB2018DB2018",
  driver_oracle: "oracle.jdbc.OracleDriver",
  // MAMAS
  url_git_mamas: "jdbc:oracle:thin:ne4/ne4@mamasgit-pub1.kabeldeutschland.de:1526/MAMASGIT",
  url_pna_mamas: "jdbc:oracle:thin:ne4/ne4@qlt2062.kabeldeutschland.de:1526:mamaspna",
  url_3test_mamas: "jdbc:oracle:thin:ne4/ne4@mamas3t-pub1.kabeldeutschland.de:1525/mamas3t",
  url_4test_mamas: "jdbc:oracle:thin:ne4/YhtpFcUDXTrwjZF9dUhC@mamasvt4-pub1.kabeldeutschland.de:1525/mamasvt4",
  // ADS
  url_git_ads: "jdbc:oracle:thin:ads_read/ads_read@adsgit-pub1.kabeldeutschland.de:1525:adsgit",
  url_pna_ads: "jdbc:oracle:thin:ads_read/ads_read@qlt2062.kabeldeutschland.de:1525/ADSPNA",
  url_3test_ads: "jdbc:oracle:thin:ads_read/ads_read@ads3t-pub1.kabeldeutschland.de:1525:ads3t",
  url_4test_ads: "jdbc:oracle:thin:ads_read/ads_read@adsvt4-pub1.kabeldeutschland.de:1525:adsvt4",
  // MAMAS-Client URLs
  url_git_c_mamas: "https://mamas-test1.kabeldeutschland.de/mktool",
  url_pna_c_mamas: "https://mamas-test2.kabeldeutschland.de/mktool",
  url_3test_c_mamas: "https://mamas-test3.kabeldeutschland.de/mktool",
  url_4test_c_mamas: "https://mamas-test4.kabeldeutschland.de/mktool",
};

// MAMAS Client URL mapping
export const MAMAS_CLIENT_URLS: Record<string, string> = {
  GIT: "https://mamas-test1.kabeldeutschland.de/mktool",
  PNA: "https://mamas-test2.kabeldeutschland.de/mktool",
  "3.TEST": "https://mamas-test3.kabeldeutschland.de/mktool",
  "4.TEST": "https://mamas-test4.kabeldeutschland.de/mktool",
};
