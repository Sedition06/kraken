# Phase 7 Analysis – Query Builder Rewrite

## Verständnis der Aufgabe

### 1. PLE-DB Lookup reaktivieren
- Original: `DbService.getDbUrl(env, app, region)` fragt PLE-DB (Oracle 11g) ab
- PLE-DB: `almp-pub1.kabeldeutschland.de:1525:ALMP` (SID-Format, Oracle 11g)
- Problem: node-oracledb Thin Mode unterstützt Oracle 11g nicht (NJS-138)
- Lösung: PLE-DB Lookup als "Try first" implementieren, Fallback auf statische Konstanten
- PLE-DB ist Oracle 11g → braucht TNS-Descriptor (SID-Format)
- ABER: NJS-138 sagt "connections to this database server version are not supported"
- Das bedeutet: Oracle 11g wird von node-oracledb Thin Mode generell NICHT unterstützt
- → Thick Mode mit Oracle Instant Client wäre nötig
- → Alternative: PLE-Lookup überspringen, nur statische Konstanten verwenden
- → ODER: Prüfen ob PLE-DB inzwischen auch auf 19c migriert wurde?

**Frage an User klären: PLE-DB ist Oracle 11g – Thin Mode kann 11g nicht. Soll trotzdem versucht werden?**
**User sagt: "bei der Suche wird sich nicht erst mit PLE DB verbunden" → Er WILL den PLE-Lookup**
**→ Ich muss den PLE-Lookup implementieren und mit detailliertem Logging versehen**
**→ Falls PLE-DB (11g) nicht erreichbar → Fallback auf statische Konstanten**

### 2. Query Builder VKD umbauen auf Views

**Bisherig (alt):**
- Hauptquery: `Select A_Adresse_ID From NE4.TA_ADRESSE Where ...`
- Subqueries gegen: NE4.TA_VMBKT_OBJEKT, NE4.TA_VMBKT_KAI, NE4.TA_VMBKT_KAA_KAD, etc.
- Separate Wizard-DB-Verbindung für Vertragscodes

**Neu laut Datenmodell (XLSX VKD-Sheet):**
- Hauptview: `NE4.V_VMBKT_ADS_ALM` – enthält die meisten Properties direkt als Spalten
  - OBJ_REGION, KAA_WORKFLOW, KAD_WORKFLOW, KAI_WORKFLOW, KAI_WOR_VFW
  - SEL_TV, OBJ_VERSORGUNGSART, OBJ_MAX_WE, DTR_MAMAS, UTR_MAMAS
  - KAA_TV, KAD_TV, KAI_TV, OBJ_UEP_ZUSTAND, VWZ_VERTRIEBSSEGMENT
- Zusätzliche Tabelle: `NE4.TA_VMBKT_OBJEKT` – für A_DOCSIS, A_ABK_FLAG, A_FIBER_COAX_FLAG
- Vertragsview: `NE4.V_WIZ_CUSTOMER_CONTRACTS` – CONTRACT_NUMBER, ACCOUNT_NUMBER, CONTRACT_CODE
  (ersetzt den direkten Wizard-DB-Zugriff!)
- Vermarktbarkeit: `NE4.V_VERMARKTBARKEIT_OBJEKT` – A_CCB1, A_CCB2

**Wichtig:** Die View V_VMBKT_ADS_ALM hat eine A_ADRESSE_ID Spalte, über die gejoint wird.

**Neue Query-Logik VKD:**
1. Hauptquery gegen `NE4.V_VMBKT_ADS_ALM` mit WHERE-Bedingungen für die View-Spalten
2. Falls DOCSIS/ABK/FTTB gesetzt → JOIN oder Subquery gegen `NE4.TA_VMBKT_OBJEKT` via A_ADRESSE_ID
3. Falls Vertragsnummer/Kundennummer/Vertragscode → Subquery gegen `NE4.V_WIZ_CUSTOMER_CONTRACTS` via A_ADRESSE_ID
4. Falls CCB1/CCB2 → Subquery gegen `NE4.V_VERMARKTBARKEIT_OBJEKT` via A_ADRESSE_ID
5. Ergebnis: Liste von A_ADRESSE_ID → dann ADS-Query für Adressdetails

### 3. Query Builder UM umbauen auf View

**Bisherig (alt):**
- JOIN von `NE4.ta_vmbkt_um_dwh` und `NE4.ta_vmbkt_um_delphi`

**Neu laut Datenmodell (XLSX UM-Sheet):**
- Hauptview: `NE4.V_VMBKT_UM_ADS_ALM` (ersetzt den dwh/delphi JOIN!)
  - OBJ_ORG, KAA_WORKFLOW, KAD_WORKFLOW, KAI_WORKFLOW, KAI_WOR_VFW
  - OBJ_SEL_VERFUEGBAR, OBJ_MAX_WE, DTR_MAMAS, UTR_MAMAS
  - OBJ_NE4_STATUS, OBJ_ABK_FLAG, OBJ_FIBER_COAX_FLAG
  - KAA_TV, KAD_TV, KAI_TV, OBJ_UEP_ZUSTAND, OBJ_GS2
- Zusätzlich: `NE4.TA_VMBKT_UM_DELPHI` nur noch für A_DOCSIS

**Neue Query-Logik UM:**
1. Hauptquery gegen `NE4.V_VMBKT_UM_ADS_ALM` mit WHERE-Bedingungen
2. Falls DOCSIS → Subquery gegen `NE4.TA_VMBKT_UM_DELPHI` via A_ADRESSE_ID
3. Ergebnis: A_ADRESSE_ID → dann ADS-Query

### 4. PLZ-Suche

**Logik laut Anforderung:**
- PLZ-Feld: 5 Ziffern, vollqualifiziert
- Wenn PLZ gesetzt: Regionen werden ignoriert
- Schritt 1: `SELECT A_Adresse_ID FROM ads.ta_adresse WHERE A_SERVICEADRESSE = 'J' AND A_V_PLZ_SUCH = :plz AND rownum <= 10000`
  - Wichtig: NUR A_V_PLZ_SUCH ist indexiert! Nicht A_PLZ!
- Schritt 2: Mit den IDs dann gegen MAMAS-Views filtern (falls weitere Filter gesetzt)
- Falls NUR PLZ ohne weitere Filter: Direkt aus ADS die Ergebnisliste holen:
  `SELECT A_Adresse_ID As OBJEKT_ID, ... FROM ads.ta_adresse WHERE A_SERVICEADRESSE = 'J' AND A_V_PLZ_SUCH = :plz AND rownum <= :maxRows`

### 5. Wizard-DB Zugriff eliminieren
- Vertragscodes, Vertragsnummer, Kundennummer → jetzt über `NE4.V_WIZ_CUSTOMER_CONTRACTS` (View mit DB-Link)
- Kein separater Wizard-DB-Zugriff mehr nötig!
