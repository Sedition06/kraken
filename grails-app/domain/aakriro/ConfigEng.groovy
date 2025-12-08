package aakriro

class ConfigEng {

    static constraints = {
    }


        static noSelection = ['': 'choose...']  // key muss Leerstring sein, damit required-Attribut funktioniert
    static button1 = "Search"
    static button2 = "Initialize"

    // GUI-Attribute
    public static company = ["Vodafone Kabel", "Unitymedia"]    // Achtung, Reihenfolge wichtig, da mehrmals per Index verglichen wird
    public static env = ["GIT", "PNA"]


    public static keys = ['ta_vmbkt_kaa_kad', 'ta_vmbkt_kai', 'ta_vmbkt_kaa_kad', 'ta_vmbkt_objekt', 'ta_vmbkt_transfer_rate', 'ta_vmbkt_wizard', 'ta_vmbkt_zpk']
    public static keysUy = ['TA_REF_SERVICE_SUBTYPE', 'TA_REF_UM_NE4_STATUS']

    public static tvKAI = ["NV":"NV - not available", "KV":"KV - shortly available", "PL3":"PL3 - planned NE3", "PL4":"PL4 - planned NE4", "TV3":"TV3 - available in NE3","TV4":"TV4 - available in NE4", "TV5":"TV5 - available"]
    public static tvKAA = ["J":"Yes", "N":"No", "KV":"shortly available"]
    public static tvKAD = ["J":"Yes", "N":"No", "KV":"shortly available"]
    public static uepZustand = ["A":"NDP-State 7", "B":"NDP-State 4-6", "C":"NDP-State <4", "0":"NDP-State undefined"]

    static tvUy = ["J":"Yes", "N":"No"]
    static wfUyKaa = ['A': 'Rejection', 'B': 'Order', 'V': 'Premarketing']
    static wfUy = ['A': 'Rejection', 'B': 'Order']
    static wfUyO2 = ['A': 'Rejection', 'B': 'Order', 'Y' : 'Permission', "S":"Overload"]

    public static uepZustandUy = ['0':'0 - Status no longer used', '1':'1 - Cable was planned for the building', '2':'2 - physical cable on property', '3':'3 - Status no longer used', '4': '4 - ÜP ready for service available', '5':'5 - ÜP ready for service but currently no active customer', '6':'6 - like 5 but ÜP physical blocked', '7':'7 - ÜP ready for service and customer active', '8':'8 - Status no longer used']

    // workflow
    public static wfKAA = ['A': 'Rejection', 'B': 'Order', 'I': 'Interest', 'V': 'Premarketing']
    public static wfKAD = ['A': 'Rejection', 'B': 'Order', 'I': 'Interest', 'V': 'Premarketing']
    public static wfKAI =  ["A":"Rejection", "B":"Order", "I":"Interest", "V":"Premarketing", "C":"Conditional Order"]

    public static salesSegment = ["GK_":"GK_", "KMU":"KMU", "PKV":"PKV", "SMB":"SMB", "WS_":"WS_", "VDF":"VDF"]
    public static ccb1 = ["0":"No access contract available", "A":"MMG available", "B":"STL / STD available", "C":"MMI available"]
    public static ccb2 = ["0":"No access contract available", "A":"MNV-Wohnung vorhanden", "B":"No MNV but 'ENV – Haus' available", "C":"VV available", "D":"'MNV – Haus' contract available at the house ", "E":"'MNV-Haus' with MMG available", "F":"MNV-Wohnung Basis (ZIB)", "K":"Durchleiter available", "L":"'MNV-Haus' Internet on building available"]
    public static docsis = ["3.0":"3.0", "3.1":"3.1"]
    public static region = ["R01", "R02", "R03", "R04", "R07", "R09"]

    static regionUy = [ 'R05', 'R06', 'R08']
    // Vertragssituation UM (GS2-Element); TA_REF_UM_GS2
    static gs2Element = ['AB':'AB - CARRIER: REHNIG BAK MMA-1 MBIT (RÜSSELSHEIM)', 'AK':'AK - CARRIER: PYUR (TCM - DTK) DKA', 'AL':'AL - ALTE LEIPZIGER LEBENSVERSICHERUNG', 'A3':'A3 - CARRIER: K.-P. & B. KERWER GBR', 'BA':'BA - CARRIER: MEDICOM AG', 'BC':'BC - CARRIER: BK-MULTIMEDIA MMA 1 MBIT', 'BE':'BE - CARRIER: BMB VIVAWEST', 'BF':'BF - CARRIER: BERGHAUS DMMA 1 MBIT + 1 FLP', 'BH':'BH - CARRIER: BMB (DRITTBESTAND)', 'BM':'BM - BAUGENOSSENSCHAFT BADEN-BADEN EG', 'BN':'BN - CARRIER: BMB (DRITTBESTAND OHNE BB)', 'BO':'BO - CARRIER: PYUR (TCM MHVA)', 'BS':'BS - CARRIER: BERGHAUS DMMA 1 MBIT', 'BW':'BW - BAUVEREIN WERNE MMA', 'B2':'B2 - PON - MMA 1 MBIT VORVERMARKTUNG', 'B3':'B3 - PON - MMA 6 MBIT VORVERMARKTUNG', 'B4':'B4 - PON - MMA 10 MBIT VORVERMARKTUNG', 'B5':'B5 - PON - MMA 32 MBIT VORVERMARKTUNG', 'B6':'B6 - PON - AV VORVERMARKTUNG', 'B7':'B7 - PON - AV VORVERMARKTUNG INKL. SERVICE', 'CF':'CF - CARRIER: CABLE4 - FH FREIBURG MMA 6 MBIT', 'CL':'CL - CARRIER: CABLE4 - BG LÖRRACH MMA 1 MBIT', 'CS':'CS - CARRIER: CABLE4 - SW BADEN MMA 6 MBIT', 'C4':'C4 - CARRIER: CABLE4 - MMA', 'DK':'DK - PON - ZINK INKL. BOX', 'DS':'DS - IW-KUNDE: MITNUTZUNG', 'DT':'DT - CARRIER: D.T. NET (EX SAT-BESTAND)', 'D1':'D1 - PON - TEILV. VORVERMARKTUNG', 'D2':'D2 - PON - TEILV. INKL. BOX VORVERMARKTUNG', 'EF':'EF - CARRIER: PYUR (TCM) RECONNECT', 'EI':'EI - EISENBAHNER WOGE SCHWERTE', 'EK':'EK - CARRIER: MICHAEL ELLER', 'EM':'EM - CARRIER: PYUR (TCM) SIGNAL', 'ER':'ER - CARRIER: PYUR (TCM) (RECONNECT) MMA 6MBIT HD (PON)', 'ES':'ES - CARRIER: PYUR (TCM) SAT', 'EV':'EV - CARRIER: PYUR (TCM) SAT-AUFBEREITUNG FREI', 'E1':'E1 - CARRIER: FUCHS ELEKTRO-TECHNIK', 'E8':'E8 - CARRIER: ROLLENBECK (KEINE HSI-KOOP)', 'FB':'FB - N/A', 'FH':'FH - CARRIER: FH-SAT GMBH MMA 10 MBIT', 'FI':'FI - FLÜWO BAU + SERVICE GMBH', 'FJ':'FJ - MÜNK & NIERLICH GMBH', 'FK':'FK - CARRIER - VERMARKTUNGSSPERRE', 'FS':'FS - CARRIER: SICOM (FREI FÜR HSI)', 'F3':'F3 - CARRIER: FRANZ PÜTZ & SOHN', 'F4':'F4 - CARRIER: OLAF GUNDLACH', 'GB':'GB - GEM. BAUVEREIN BERGISCHES HEIM', 'GF':'GF - CARRIER: GLASFASER RUHR MMA 6 MBIT', 'GG':'GG - CARRIER: GLASFASER BG HEIMAT BO-STIEPEL MMA 6 MBIT', 'GL':'GL - H.-J. GLAWE GMBH (OHNE AUSBAU)', 'GM':'GM - GEWOBAU ESSEN DMMA 1 MBIT', 'GQ':'GQ - H.-J. GLAWE GMBH', 'GS':'GS - GSWG SENNE DMMA 1 MBIT + FLP', 'GV':'GV - CARRIER: GLASFASER VBW MMA 6 MBIT + GEBÄUDEKONNEKTIVITÄT', 'GW':'GW - DMMA + 1 FLP PILOT', 'G6':'G6 - CARRIER: GELSEN-NET (OHNE AUSBAU)', 'G7':'G7 - CARRIER: GFK OBERHAUSEN', 'G9':'G9 - CARRIER: GELSEN-NET (FREI FÜR HSI)', 'HE':'HE - HAUSVERWALTUNG HEEß-MAIER', 'HH':'HH - N/A', 'HK':'HK - HAUSVERW. KRÄMER GMBH, BRUCHKÖBEL', 'H1':'H1 - CARRIER: IMMOMEDIANET (GWH) HD-MMA 1 MBIT (PON)', 'ID':'ID - CARRIER: PYUR (TCM) UMSCHALTUNG AUF FREMDNETZ', 'IE':'IE - UM HESSEN (FÜR UM NRW GMBH)', 'IM':'IM - CARRIER: IMMOMEDIANET', 'IN':'IN - CARRIER: IMMOMEDIANET (OHNE AUSBAU)', 'IS':'IS - CARRIER: STG', 'KD':'KD - CARRIER: VODAFONE (KABEL DEUTSCHLAND)', 'KE':'KE - KEIM NETZTECHNIK FTTB-PARTNER', 'KH':'KH - K.-H. DIETRICH', 'KK':'KK - N/A', 'KM':'KM - KAUFMÄNNISCH MITVERSORGT', 'KR':'KR - CARRIER: VODAFONE (KDG REGION RHEINLD-PF./SAARLAND)', 'KS':'KS - CARRIER: KP-KABEL (SAT ZF)', 'KT':'KT - CARRIER: TROSCHKE ANTENNEN TECHNIK', 'K5':'K5 - CARRIER: MBG EHEM. KTV MÜLHEIM', 'K6':'K6 - CARRIER: MBG - KTVM (NEU-BESTAND)', 'LE':'LE - LEG SAT ZINK', 'LG':'LG - LEG -NE4- KEINE AUTRÄGE EINGEBEN!!', 'LS':'LS - LEG SPEZIAL MMA 1 MBIT', 'LW':'LW - N/A', 'L2':'L2 - CARRIER: LINZENICH', 'MB':'MB - CARRIER: MBG', 'MC':'MC - CARRIER: MEDICOM DREIEICH (AUßERHALB DREIEICH)', 'MG':'MG - CARRIER: PYUR (TCM) MMA 1 MBIT', 'MK':'MK - CARRIER: MULTIMEDIA-KABEL GMBH', 'MM':'MM - CARRIER: REHNIG (TURLEY AREAL)', 'MO':'MO - MMA OHMSTR.70-74', 'MT':'MT - MTV IMMOBILIEN-VERW. GMBH, BAD SODEN', 'MW':'MW - CARRIER: MYWIRE (FREI FÜR HSI)', 'MY':'MY - CARRIER: MYWIRE (NUR DTV)', 'M1':'M1 - CARRIER: M-GRUPPE (NUR DTV)', 'M2':'M2 - CARRIER: M-GRUPPE (FREI FÜR HSI)', 'M5':'M5 - CARRIER: M-GRUPPE MMA 1 MBIT', 'M7':'M7 - CARRIER: MBG (DKA RV)', 'M8':'M8 - CARRIER: MBG MMA 1 MBIT (WB ESSEN)', 'NA':'NA - CARRIER: NETAACHEN SIGNALANMIETUNG', 'NB':'NB - NETAACHEN - EIGENES NETZ', 'NC':'NC - CARRIER: NETCOLOGNE SIGNALANMIETUNG', 'ND':'ND - CARRIER: NETCOLOGNE (NUR DIGITAL)', 'NE':'NE - NEUE MARLER BG DMMA FLP', 'NF':'NF - CARRIER: NETAACHEN (FREI FÜR HSI)', 'NG':'NG - N/A', 'NH':'NH - NAM KUNDE - HSI VERMARKTUNGSSPERRE', 'NK':'NK - NAM KUNDE - KOMPL. VERMARKTUNGSSPERRE', 'NL':'NL - LEGALFÄLLE: INSTALLATIONSVERBOT LT. LEGAL', 'NM':'NM - CARRIER: NETCOLOGNE (FREI FÜR HSI)', 'NN':'NN - NETCOLOGNE-EIGENES NETZ', 'NO':'NO - NAM KUNDE - HAUSVERBOT', 'NT':'NT - N/A', 'NV':'NV - CARRIER: HSI VERMARKTUNGSSPERRE', 'OH':'OH - HDMMA32MBIT SC ONLY', 'PA':'PA - PADERBORN - DMMA-PLUS', 'PC':'PC - CARRIER: PYUR (TCM - PC) MMA 1 MBIT', 'PK':'PK - CARRIER: PKS GMBH (NUR DTV)', 'PP':'PP - CARRIER: PKS GMBH (FREI FÜR HSI)', 'PQ':'PQ - CARRIER: PYUR (TCM - PEPCOM) SIGNAL', 'PR':'PR - N/A', 'PS':'PS - N/A', 'PT':'PT - N/A', 'PU':'PU - N/A', 'PV':'PV - N/A', 'P1':'P1 - CARRIER: PASCHMANNS (NUR DTV)', 'P2':'P2 - CARRIER: PASCHMANNS (FREI FÜR HSI)', 'P3':'P3 - CARRIER: PASCHMANNS MMA 6 MBIT (GWG VIERSEN)', 'QA':'QA - CARRIER: PYUR (TCM - PC) SIGNAL', 'QB':'QB - CARRIER: PYUR (TCM - PC SIGNAL) NEUSS', 'QC':'QC - CARRIER: PYUR (TCM - PC SIGNAL) SINGEN', 'QD':'QD - CARRIER: PYUR (TCM - PC) SIGNAL WANGEN', 'QE':'QE - N/A', 'QF':'QF - CARRIER: FERNWÄRME TRANSPORTGES. MBH', 'QG':'QG - N/A', 'QH':'QH - CARRIER: PYUR (TCM - PC) SERVICE UM-DEZENTRALE NETZE', 'QI':'QI - N/A', 'QJ':'QJ - CARRIER: PYUR (TCM - PC DTK) MMA 1 MBIT', 'QK':'QK - CARRIER: PYUR (TCM - PC DTK) SIGNAL', 'QL':'QL - CARRIER: PYUR (TCM - PC DTK MHVA)', 'QM':'QM - CARRIER: MEDICOM DREIECH-VERMARKTUNGSSPERRE', 'QN':'QN - N/A', 'QO':'QO - CARRIER: PYUR (TCM - KMS) MMA 1 MBIT', 'QP':'QP - CARRIER: PYUR (TCM - KMS) SIGNAL', 'QQ':'QQ - CARRIER: PYUR (TCM - KCR) SIGNAL', 'QR':'QR - CARRIER: PYUR (TCM - WTC) SIGNAL', 'QS':'QS - CARRIER: PYUR (TCM - MEDIACOM) SIGNAL', 'QT':'QT - N/A', 'QU':'QU - N/A', 'QV':'QV - N/A', 'QW':'QW - N/A', 'QX':'QX - N/A', 'QY':'QY - N/A', 'QZ':'QZ - CARRIER: PYUR (TCM - WTC) RECONNECT', 'Q0':'Q0 - CARRIER: PYUR (TCM - MEDIACOM) RECONNECT', 'Q1':'Q1 - N/A', 'Q2':'Q2 - N/A', 'Q3':'Q3 - CARRIER: CABLE4 - FSB NUR MOBIL', 'Q4':'Q4 - CARRIER: CABLE4 - FREIBURGER STADTBAU', 'Q5':'Q5 - N/A', 'Q6':'Q6 - N/A', 'Q7':'Q7 - N/A', 'Q8':'Q8 - N/A', 'Q9':'Q9 - N/A', 'RA':'RA - CARRIER: REHNIG BAK MMA 6 MBIT', 'RB':'RB - RHEINISCHE BEAMTEN BAUGESELLSCHAFT MBH', 'RC':'RC - CARRIER: REHNIG BAK MMA 32 MBIT', 'RE':'RE - CARRIER: REHNIG BAK MMA 1 MBIT', 'RI':'RI - CARRIER: RIDACOM GMBH MMA 6 MBIT', 'RM':'RM - RHEIN-MAINISCHE AG - MMA', 'RN':'RN - CARRIER: RNT (NUR DTV)', 'RU':'RU - RUHRGEBIET MMA 1 MBIT', 'R1':'R1 - CARRIER: RIDACOM E.K.', 'R2':'R2 - N/A', 'R3':'R3 - CARRIER: REHNIG (FREI FÜR HSI)', 'R5':'R5 - CARRIER: RIDACOM GMBH', 'R9':'R9 - CARRIER: REHNIG BAK MMA 1 MBIT (GSW)', 'SB':'SB - PON - MMA 1 MBIT BK + SAT ANLAGE SERVICE & WARTUNG DURCH UM', 'SC':'SC - PON - MMA 6 MBIT BK+SAT-ZF ANLAGE SERVICE & WARTUNG DURCH UM', 'SD':'SD - SWD MMA 6 MBIT + GEBÄUDEKONNEKTIVITÄT', 'SF':'SF - FREIBURGER STADTBAU-EINZELVERMARKTUNG', 'SG':'SG - CARRIER: STG HAGEN MMA 1 MBIT HD (GWG)', 'SK':'SK - CARRIER: SACHS KABEL SERVICE', 'SN':'SN - STADTNETZ', 'SQ':'SQ - UNITYMEDIA SAT ANLAGE MIT SERVICE UND WARTUNG', 'SR':'SR - PON - DMMA 1 MBIT BK + SAT ANLAGE SERVICE & WARTUNG DURCH UM', 'ST':'ST - CARRIER: STG IMMEO DMMA', 'SU':'SU - SUDHOFF HAUSVERWALTUNG', 'SV':'SV - SAT - VERSORGUNG DURCH NE4 BETREIBER', 'SW':'SW - CARRIER: STG HAGEN MMA 1 MBIT HD (WVH)', 'SX':'SX - CARRIER: SICOM SAT (FREI FÜR HSI)', 'SY':'SY - SAT - VERSORGUNG DURCH EIGENTÜMER', 'S1':'S1 - SWSG - DMMA 1 MBIT INKL. BOX', 'S2':'S2 - CARRIER: ELEKTRO STEVERDING', 'S3':'S3 - STUDIERENDENWERK STUTTGART AöR', 'S4':'S4 - VEREINIGUNG STUTTGARTER STUDENTENWOHNHEIME E.V.', 'TK':'TK - CARRIER: TKS MMA 1 MBIT (BESTAND HES)', 'TM':'TM - CARRIER: TELEMARK', 'TN':'TN - MET MMA 6 MBIT +FLP+HD+HW 3 (BESTAND NH)', 'TR':'TR - MET MMA 6 MBIT +FLP+HD+HW 3 (REST HES)', 'TS':'TS - MET (SAT-VERSORGUNG) SERVICE DURCH UM', 'TT':'TT - MET MMA 6 MBIT +FLP+HD+HW 3 (BESTAND KASSEL)', 'UA':'UA - ALLBAU ESSEN MMA 1 MBIT + FLP', 'U1':'U1 - URBANIA', 'U2':'U2 - N/A', 'U7':'U7 - PON - VERSORGUNGSVEREINBARUNG (UMS BESTAND)', 'VD':'VD - CARRIER: PYUR (TCM -VONOVIA-PC DTK) MMA 1 MBIT', 'VM':'VM - CARRIER: PYUR (TCM -VONOVIA-PC) MMA 1 MBIT', 'VS':'VS - CARRIER: PYUR (TCM -VONOVIA-PC) SIGNAL', 'VT':'VT - CARRIER: PYUR (TCM -VONOVIA-PC DTK) SIGNAL', 'V1':'V1 - CARRIER: GAGFAH', 'V2':'V2 - CARRIER: CABLE 4', 'V3':'V3 - CARRIER: ANTENNENGEM. MÜNCHWEIER', 'V4':'V4 - CARRIER: BK-KABELSERVICE', 'V5':'V5 - CARRIER: DELLMUD ANTENNENBAU', 'V6':'V6 - CARRIER: ELEKTRO BUCK', 'V7':'V7 - CARRIER: ELEKTRO RIEDESSER', 'V8':'V8 - CA_BW_STADT WEINSBERG', 'V9':'V9 - CARRIER: LAMPARTER', 'WA':'WA - WOHNBAU BONN (UM) PON ZINK', 'WD':'WD - WOGE WERDOHL DUALE NE4', 'WG':'WG - N/A', 'WH':'WH - CARRIER: W&H (FREI FÜR HSI)', 'WO':'WO - WG IM KREIS OLPE HD', 'WR':'WR - CARRIER: W&H MMA 1 MBIT + 1 FLP + HW 3 ?', 'WT':'WT - WOHNBAU BONN (KDG UMS) PON ZINK', 'WU':'WU - GWG WUPPERTAL MMA 128 KB (OHNE TELEFONIE)', 'WX':'WX - WV MÜNSTER V.1893 MMA 1 MBIT', 'W0':'W0 - CARRIER: W&H MMA', 'W7':'W7 - CARRIER: WINNEN (FREI FÜR HSI)', 'W8':'W8 - CARRIER: W&H (NUR DTV)', 'W9':'W9 - CARRIER: WINNEN (NUR DTV)', 'X1':'X1 - CARRIER: REHNIG (SERVICEHAUS) (LEERSTAND)', 'X2':'X2 - NETCOLOGNE - SPERRE', 'X3':'X3 - CARRIER: REHNIG (SERVICEHAUS)', 'X4':'X4 - N/A', 'X5':'X5 - CARRIER: STADT TÜBINGEN', 'X6':'X6 - CARRIER: TELEKA', 'X7':'X7 - CARRIER: TKS MMA 1 MBIT (BESTAND BAWÜ)', 'X8':'X8 - CARRIER: HÖR ANTENNENTECHNIK', 'X9':'X9 - CARRIER: D.T. NET SERVICE OHG', 'Y1':'Y1 - CARRIER: AT-SALES GMBH', 'Y2':'Y2 - CARRIER: KABEL SCHEMPP', 'Y4':'Y4 - CARRIER: VODAFONE DEUTSCHLAND GMBH', 'Y5':'Y5 - CARRIER: KSR REDEMANN', 'Y6':'Y6 - N/A', 'Y8':'Y8 - CARRIER: MEDICOM SONNEBERG', 'ZB':'ZB - N/A', 'ZC':'ZC - CARRIER: TELESAT', 'ZE':'ZE - CARRIER: MARIABERG', 'ZF':'ZF - CARRIER: SWU TELENET GMBH', 'ZG':'ZG - CARRIER: REHNIG MMA 1 MBIT + HD (BOSCH WB)', 'ZH':'ZH - CARRIER: ZIEGELMEIER MMA 1 MBIT', 'Z0':'Z0 - CARRIER: TKE GMBH', 'Z1':'Z1 - CARRIER: FH-SAT GMBH', 'Z2':'Z2 - CARRIER: TRÖGER', 'Z3':'Z3 - CARRIER: AUBELE', 'Z5':'Z5 - CARRIER: CA-ANTENNEN- SERVICE', 'Z9':'Z9 - CARRIER: RADIO DURACH', '00':'00 - N/A', '05':'05 - PON - VERTRAGSART PRÜFEN', '09':'09 - ALLBAU (EINZELVERMARKTUNG)', '11':'11 - CARRIER: IMMOMEDIANET (GWH) DMMA 1 MBIT (PON)', '13':'13 - N/A', '15':'15 - PON - ZINK', '16':'16 - PON - ZINKB', '17':'17 - PON - VERSORGUNGSVEREINBARUNG', '18':'18 - PON - AV VOLLVERMARKTUNG', '19':'19 - SERVICE PLUS', '20':'20 - PON - AV TEILVERMARKTUNG', '21':'21 - PON - MMA 128 KB', '22':'22 - PON - MMA 1 MBIT', '23':'23 - CARRIER: MEDICOM DREIEICH (INNERHALB DREIEICH)', '27':'27 - CARRIER: PYUR (TCM) SAT-ZF', '28':'28 - PON - AV VOLLVERMARKTUNG INKL. BOX', '29':'29 - PON - AV TEILVERMARKTUNG INKL. BOX', '33':'33 - CARRIER: UNITYMEDIA BW', '38':'38 - GAT GEMEINSCHAFTS-ANTENNEN-TECHNIK', '44':'44 - DMMA 128 KB', '45':'45 - PON - DMMA 128 KB INKL. BOX', '47':'47 - PON - DMMA 128 KB + 1 FLP INKL. BOX', '49':'49 - PON - DMMA 1 MBIT INKL. BOX', '50':'50 - PON - MMA 6 MBIT', '51':'51 - PON - HD MMA 6 MBIT INKL. BOX', '53':'53 - PON - DMMA 10 MBIT INKL. BOX', '55':'55 - PON - MMA 10 MBIT', '56':'56 - PON - DMMA 1 MBIT SC ONLY', '57':'57 - PON - DMMA 32 MBIT INKL. BOX', '58':'58 - PON - HD MMA 128 KB INKL. BOX', '59':'59 - PON - HD MMA 10 MBIT INKL. BOX', '60':'60 - PON - MMA 32 MBIT', '63':'63 - N/A', '64':'64 - PON - HD-MMA 1 MBIT INKL. BOX', '65':'65 - PON - ZINK HD INKL. BOX', '70':'70 - PON - NE4 SERVICE', '73':'73 - PON - AV TEILVERMARKTUNG + NE4 SERVICE', '75':'75 - PON - AV VOLLVERMARKTUNG + NE4 SERVICE', '77':'77 - PON - AV VOLLVERMARKTUNG INKL. BOX + NE4 SERVICE', '79':'79 - PON - AV TEILVERMARKTUNG INKL. BOX + NE4 SERVICE', '80':'80 - N/A', '81':'81 - N/A', '82':'82 - N/A', '83':'83 - N/A', '84':'84 - N/A', '85':'85 - PON - MMA 20 MBIT', '86':'86 - PON - MMA 50 MBIT', '87':'87 - PON - MMA 100 MBIT', '92':'92 - N/A', '98':'98 - N/A']


    // heading
    static head1 = "Basic settings"
    static head3 = "Technical parameters"
    static head4 = "Technical availability"
    static head5 = "Contract situation"

    // label
    static  label1 = "Access contract"
    static label2 = "Customer no."
    static label3 = "Contract no."
    static label4 = "Permission contract"
    static label5 = "Environment"
    static labelDS = "Data rate downstream"
    static labelUS = "Data rate upstream"
    static labelMaxWe = "max. flat"
    static  labelUep = "NDP-State"
    static labelJaNeinBeides = ['Yes', 'No', 'Both']
    static labelJaNein = ['Yes', 'No']
    static labelVertragscode = "Contract code"
    static labelBewohnerPlus = "Tenant discount"
    static labelDirektVersorgt = "directly supplied"
    static labelResults = "No. of results"
    static labelCoaxFiberBeides = ['Coax', 'Fiber', 'Both']
    static labelGs2Element = "GS2 Element"

    // placeholder
    static vonBis = ['from', 'to']

    // Tabelle
    static tHeadId = "VF AddressID"
    static tHeadUmId = "UM AddressID"
    static tHeadAdr = "Address"
    static tHeadOnkz = "ONKZ"
    static noResult = "no data found"

    // Tooltips
    static ttKaa = "Cable service category"
    static ttKad = "Service Category Cable Digital"
    static ttKai = "Service Category Cable Internet"
    static ttSelfinstall = "Modem installation by technician or by customer"
    static ttDirektVersorgt = "Object has its own transfer point (NDP) or is supplied by a cable from another building"
    static ttMaxWe = "residential units in the object"
    static ttDsDatenrate = "Downstream data rate"
    static ttUsDatenrate = "Upstream data rate"
    static ttDocsis = "Transmission standard Internet cable networks"
    static ttUepZustand = "state of the transfer point"
    static ttUmgebung = "Selection of the test environment"
    static ttFootprint = "Vodafone or UM regions"
    static ttRegion = "Vodafone or UM region"
    static ttO2 = "Addresses marketed by Telefonica O2"
    static ttBewohnerPlus = "Addresses with the Renter Bonus attribute"
    static ttAbk = "Projekt Futurize, disconnected"
    static ttGs2 = "Building segment"
}
