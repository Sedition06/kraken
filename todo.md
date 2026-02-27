# Kraken-Tool TODO

## Frontend (Phase 1 - abgeschlossen)
- [x] Header mit Logo, Sprachumschalter DE/EN, MAMAS-Link, Buttons
- [x] Grundeinstellungs-Panel (Umgebung, Footprint, Region, PLZ, Ergebnisse, O2, BewohnerPlus, OXG Fiber)
- [x] Workflow-Panel mit farbcodierten Dropdowns (KAA, KAD, KAI)
- [x] Technische Parameter Panel (SelfInstall, direkt Versorgt, maxWE, DS/US, DOCSIS, ABK, FTTB, NE4)
- [x] Technische Verfügbarkeit Panel (KAA, KAD, KAI, ÜP-Zustand)
- [x] Vertragssituation VKD (Vertrags-/Kundennummer, Gestattung, Anschluss, Salessegment, Vertragscodes)
- [x] Vertragssituation UM (GS2 Element)
- [x] BewohnerPlus Panel
- [x] OXG Fiber Status Panel
- [x] Ergebnistabelle mit Demo-Modus
- [x] Easter-Egg auf Logo-Doppelklick
- [x] API-Dokumentationsseite
- [x] Zweisprachigkeit (DE/EN)

## Backend (Phase 2 - aktuell)
- [x] web-db-user Feature Upgrade
- [x] Oracle DB Verbindungslogik (PLE-Umgebungen: GIT, PNA, 3.TEST, 4.TEST)
- [x] SQL-Query-Builder für VKD Footprint (V_VMBKT_ADS_ALM)
- [x] SQL-Query-Builder für UM Footprint (V_UY_ADS_ALM)
- [x] REST-API Endpunkt /api/search für Formularsuche
- [x] REST-API Endpunkt /api/kraken für externe API-Zugriffe
- [x] Frontend: API-Anbindung statt Demo-Modus
- [x] Vitest Tests für Backend-Logik (26 Tests bestanden)
- [ ] GitHub Export (nächster Schritt)

## Hinweise
- Oracle DB erfordert VPN-Zugang (PLE-Umgebungen sind nur intern erreichbar)
- oracledb npm-Paket wird für die DB-Verbindung benötigt
