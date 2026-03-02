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
- [x] GitHub Export (gepusht nach Sedition06/kraken)

## Hinweise
- Oracle DB erfordert VPN-Zugang (PLE-Umgebungen sind nur intern erreichbar)
- oracledb npm-Paket wird für die DB-Verbindung benötigt

## Cleanup (Phase 3 - aktuell)
- [x] OAuth-Pflichtprüfung aus Server entfernen (nur noch Info-Log, kein Error mehr)
- [x] VITE_ANALYTICS_ENDPOINT und VITE_ANALYTICS_WEBSITE_ID aus index.html entfernt
- [x] Server startet ohne externe Dienste sauber
- [x] GitHub Push nach Cleanup (77a82a7)

## Fixes (Phase 4)
- [x] Oracle PLE-Lookup (11g) entfernt, statische JDBC-Konfiguration direkt genutzt (kein NJS-138 mehr)
- [x] Sprachumschalter DE/EN als Toggle-Schieberegler implementiert
- [x] Workflow-Dropdowns durch Custom ColorSelect ersetzt (Farben beim Öffnen sichtbar)

## Diagnose (Phase 5)
- [x] Detailliertes Logging: DB-Connection-String, SQL-Query, Fehlerdetails (oracle-config, oracle-db, kraken-service)
- [ ] GitHub Push nach Logging-Erweiterung
