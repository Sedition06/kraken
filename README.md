# KRAKEN - Testadress-Ermittlungstool

Ein internes Werkzeug zur Ermittlung von Testadress-IDs aus der MAMAS-Datenbank für Vodafone Kabel (VKD) und Unitymedia (UM) Footprints.

## Architektur

- **Frontend:** React 19 + TypeScript + Tailwind CSS
- **Backend:** Express 4 + tRPC + Oracle DB (oracledb thin client)
- **Datenbank:** Oracle (MAMAS NE4, ADS, Wizard) über PLE-Umgebungen

## Voraussetzungen

- Node.js >= 22
- pnpm >= 10
- **VPN-Zugang** zu den Vodafone-internen Oracle-Datenbanken (PLE-Umgebungen)

## Installation

```bash
pnpm install
```

## Entwicklung

```bash
pnpm dev
```

Der Dev-Server startet auf `http://localhost:3000`.

## Tests

```bash
pnpm test
```

## API-Endpunkte

| Endpunkt | Methode | Beschreibung |
|---|---|---|
| `/api/search` | POST | GUI-Suche (Formular-Payload als JSON) |
| `/api/kraken` | GET | Externe API (Query-Parameter) |
| `/api/health` | GET | Health-Check |

### Beispiel: Externe API

```
GET /api/kraken?environment=GIT&footprint=Vodafone+Kabel&results=5&wfKaa=B&regions=R01,R02
```

## Umgebungen

| Kürzel | PLE-Name | Beschreibung |
|---|---|---|
| GIT | GIT | Gesamtintegrationstest |
| PNA | Prodnah | Produktionsnahe Umgebung |
| 3.TEST | 3. Test | 3. Testumgebung |
| 4.TEST | VT4 | 4. Testumgebung |

## Projektstruktur

```
client/src/
  pages/Home.tsx          → Hauptformular (alle Panels)
  pages/ApiDocs.tsx       → API-Dokumentationsseite
  lib/config.ts           → Konstanten (Regionen, Workflows, etc.)
  lib/datamodel.ts        → Neues Datenmodell (XLSX-basiert)
  hooks/useKrakenForm.ts  → Formular-State-Management
  contexts/LanguageContext.tsx → Zweisprachigkeit DE/EN
  components/             → KrakenSelect, MultiSelect, CollapsiblePanel

server/
  oracle-config.ts        → DB-Verbindungskonfiguration (PLE + Fallback)
  oracle-db.ts            → Oracle Connection Pooling & Query Execution
  query-builder-vkd.ts    → SQL-Builder für VKD Footprint
  query-builder-um.ts     → SQL-Builder für UM Footprint
  kraken-service.ts       → Such-Orchestrierung (MAMAS → ADS)
  kraken-routes.ts        → Express API-Routen
  kraken.test.ts          → Vitest Tests (26 Tests)
```

## Migriert von

Ursprünglich ein Grails 3.3.9 Projekt (Groovy/GSP). Vollständig neu implementiert in React/Express.
