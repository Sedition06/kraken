package aakriro

class Config {

    static constraints = {
    }

    // Version
    static final version = "2025.04.14" // year.month.week

    // URL MAMAS-Client
    public static final url_git_c_mamas = "https://mamas-test1.kabeldeutschland.de/mktool"
    public static final url_pna_c_mamas = "https://mamas-test2.kabeldeutschland.de/mktool"
    public static final url_3test_c_mamas = "https://mamas-test3.kabeldeutschland.de/mktool"
    public static final url_4test_c_mamas = "https://mamas-test4.kabeldeutschland.de/mktool"

    // DB MAMAS
    public static final url_git_mamas = "jdbc:oracle:thin:ne4/ne4@mamasgit-pub1.kabeldeutschland.de:1526/MAMASGIT"
    public static final url_pna_mamas = "jdbc:oracle:thin:ne4/ne4@qlt2062.kabeldeutschland.de:1526:mamaspna"
    public static final url_3test_mamas = "jdbc:oracle:thin:ne4/ne4@mamas3t-pub1.kabeldeutschland.de:1525/mamas3t"
    public static final url_4test_mamas = "jdbc:oracle:thin:ne4/YhtpFcUDXTrwjZF9dUhC@mamasvt4-pub1.kabeldeutschland.de:1525/mamasvt4"

    // DB ADS
    public static final url_git_ads = "jdbc:oracle:thin:ads_read/ads_read@adsgit-pub1.kabeldeutschland.de:1525:adsgit"
    public static  final url_pna_ads = "jdbc:oracle:thin:ads_read/ads_read@qlt2062.kabeldeutschland.de:1525/ADSPNA"
    public static final url_3test_ads = "jdbc:oracle:thin:ads_read/ads_read@ads3t-pub1.kabeldeutschland.de:1525:ads3t"
    public static final url_4test_ads = "jdbc:oracle:thin:ads_read/ads_read@adsvt4-pub1.kabeldeutschland.de:1525:adsvt4"

    // DB Wizard GIT
    public static final url_git_wiz1_r01 = "jdbc:oracle:thin:prod01_read/prod01_read@wizprod1git-pub1.kabeldeutschland.de:1521:wizprod1"
    public static final url_git_wiz1_r02 = "jdbc:oracle:thin:prod02_read/prod02_read@wizprod1git-pub1.kabeldeutschland.de:1521:wizprod1"
    public static final url_git_wiz1_r04 = "jdbc:oracle:thin:prod04_read/prod04_read@wizprod1git-pub1.kabeldeutschland.de:1521:wizprod1"

    public static final url_git_wiz2_r03 = "jdbc:oracle:thin:prod03_read/prod03_read@wizprod2git-pub1.kabeldeutschland.de:1524:wizprod2"
    public static final url_git_wiz2_r07 = "jdbc:oracle:thin:prod07_read/prod07_read@wizprod2git-pub1.kabeldeutschland.de:1524:wizprod2"
    public static final url_git_wiz2_r09 = "jdbc:oracle:thin:prod09_read/prod09_read@wizprod2git-pub1.kabeldeutschland.de:1524:wizprod2"

    // DB Wizard PNA
    public static final url_pna_wiz1_r01 = "jdbc:oracle:thin:prod01_read/prod01_read@wizprod1pna-pub1.kabeldeutschland.de:1521:wizprod1"
    public static final url_pna_wiz1_r02 = "jdbc:oracle:thin:prod02_read/prod02_read@wizprod1pna-pub1.kabeldeutschland.de:1521:wizprod1"
    public static final url_pna_wiz1_r04 = "jdbc:oracle:thin:prod04_read/prod04_read@wizprod1pna-pub1.kabeldeutschland.de:1521:wizprod1"

    public static final url_pna_wiz2_r03 = "jdbc:oracle:thin:prod03_read/prod03_read@wizprod2pna-pub1.kabeldeutschland.de:1524:wizprod2"
    public static final url_pna_wiz2_r07 = "jdbc:oracle:thin:prod07_read/prod07_read@wizprod2pna-pub1.kabeldeutschland.de:1524:wizprod2"
    public static final url_pna_wiz2_r09 = "jdbc:oracle:thin:prod09_read/prod09_read@wizprod2pna-pub1.kabeldeutschland.de:1524:wizprod2"

    // DB Wizard 3.TEST
    public static final url_3test_wiz1_r01 = "jdbc:oracle:thin:prod01_read/prod01_read@wizprod13t-pub1.kabeldeutschland.de:1521:wizprod1"
    public static final url_3test_wiz1_r02 = "jdbc:oracle:thin:prod02_read/prod02_read@wizprod13t-pub1.kabeldeutschland.de:1521:wizprod1"
    public static final url_3test_wiz1_r04 = "jdbc:oracle:thin:prod04_read/prod04_read@wizprod13t-pub1.kabeldeutschland.de:1521:wizprod1"

    public static final url_3test_wiz2_r03 = "jdbc:oracle:thin:prod03_read/prod03_read@wizprod23t-pub1.kabeldeutschland.de:1524:wizprod2"
    public static final url_3test_wiz2_r07 = "jdbc:oracle:thin:prod03_read/prod03_read@wizprod23t-pub1.kabeldeutschland.de:1524:wizprod2"
    public static final url_3test_wiz2_r09 = "jdbc:oracle:thin:prod09_read/prod09_read@wizprod23t-pub1.kabeldeutschland.de:1524:wizprod2"


    // DB Wizard 4.TEST
    public static final url_4test_wiz1_r01 = "jdbc:oracle:thin:prod01_read/prod01_read@wizprod1vt4-pub1.kabeldeutschland.de:1521:wizprod1"
    public static final url_4test_wiz1_r02 = "jdbc:oracle:thin:prod02_read/prod02_read@wizprod1vt4-pub1.kabeldeutschland.de:1521:wizprod1"
    public static final url_4test_wiz1_r04 = "jdbc:oracle:thin:prod04_read/prod04_read@wizprod1vt4-pub1.kabeldeutschland.de:1521:wizprod1"

    public static final url_4test_wiz2_r03 = "jdbc:oracle:thin:prod03_read/prod03_read@wizprod2vt4-pub1.kabeldeutschland.de:1524:wizprod2"
    public static final url_4test_wiz2_r07 = "jdbc:oracle:thin:prod07_read/prod07_read@wizprod2vt4-pub1.kabeldeutschland.de:1524:wizprod2"
    public static final url_4test_wiz2_r09 = "jdbc:oracle:thin:prod09_read/prod09_read@wizprod2vt4-pub1.kabeldeutschland.de:1524:wizprod2"

    // DB PLE
    public static final url_ple = "jdbc:oracle:thin:@almp-pub1.kabeldeutschland.de:1525:ALMP"
    public static final user_ple = "QC_NGPLE"
    public static final pw_ple = "QC_NGPLE.DB2018DB2018"

    // DB Treiber
    public static final driver_oracle = "oracle.jdbc.OracleDriver"



    // SQLspezifisch
    public static selectAds = """
Select /*+ parallel($threads) */
        A_Adresse_ID As OBJEKT_ID, A_UM_GEBAEUDE_ID As UM_ADRESSE_ID,  A_PLZ || ' ' || A_ORTSNAME || ', ' || A_STRNAME || ' ' || A_HAUSNR || ' ' || A_HAUSNR_ZUS AS ADRESSE, A_REF_TELEFONIE_ONKZ AS ONKZ
  From ADS.TA_ADRESSE
  Where """
    // 15.10.2020 - auf 2 Konstanten aufgesplittet, wegen AF Mail Stephan 15.10.20 10:47

 //   public static selectMamasAds = """
//Select /*+ parallel($threads) */
//        A_Adresse_ID As OBJEKT_ID, A_PLZ || ' ' || A_ORTSNAME || ', ' || A_STRNAME || ' ' || A_HAUSNR || ' ' || A_HAUSNR_ZUS AS ADRESSE, A_REGION As ONKZ
//  From ADS.TA_ADRESSE
//  Where """


    public static selectMamasAds = """
Select /*+ parallel($threads) */
        A_Adresse_ID  From ADS.TA_ADRESSE
  Where """

    public static final threads = '30'
    public static final maxRows = "10"

    static widthContainer = "875px"
    static width = "250px"

    static button1 = "Suchen"
    static button2 = "Initialisieren"
    static noSelection = ['': 'auswählen...']   // key muss Leerstring sein, damit required-Attribut funktioniert


    // GUI-Attribute
    public static company = ["Vodafone Kabel":"Vodafone Kabel", "Unitymedia":"Unitymedia"]    // Achtung, Key nicht verändern!
    public static env = ["GIT":"GIT", "PNA":"PNA", "3.TEST":"3.TEST", "4.TEST":"4.TEST"]


    public static keys = ['ta_vmbkt_kaa_kad', 'ta_vmbkt_kai', 'ta_vmbkt_kaa_kad', 'ta_vmbkt_objekt', 'ta_vmbkt_transfer_rate', 'ta_vmbkt_wizard', 'ta_vmbkt_zpk', 'bewohner_Plus']
    public static keysUy = ['TA_REF_SERVICE_SUBTYPE', 'TA_REF_UM_NE4_STATUS']

    public static tvKAI = ["NV":"NV - Nicht verfügbar", "KV":"KV - Kurzfristig verfügbar", "PL3":"PL3 - Geplant NE3", "PL4":"PL4 - Geplant NE4", "TV3":"TV3 - Verfügbar in NE3","TV4":"TV4 - Verfügbar in NE4", "TV5":"TV5 - Verfügbar"]
    public static tvKAA = ["J":"Ja", "N":"Nein", "KV":"kurzfristig verfügbar"]
    public static tvKAD = ["J":"Ja", "N":"Nein", "KV":"kurzfristig verfügbar"]
    //public static uepZustand = ["A":"ÜP-Zustand 7", "B":"ÜP-Zustand 4-6", "C":"ÜP-Zustand <4", "0":"ÜP-Zustand undefiniert"]
    public static uepZustand = ["0":"0 - ÜP noch nicht geplant, Grundstück bereits erfasst", "1":"1 - ÜP geplant und die C-Linie nicht in Betrieb", "2":"2 - ÜP geplant und die C-Linie in Betrieb", "3":"3 - ÜP montiert, aber C-Linie nicht in Betrieb", "4":"4 - ÜP ist unverplombt betriebsbereit", "5":"5 - ÜP unverplombt betriebsbereit, zzt keine WE angemeldet", "6":"6 - ÜP verplombt, da zzt keine WE angemeldet", "7":"7 - ÜP betriebsbereit und angemeldet"]

    static tvUy = ["J":"Ja", "N":"Nein"]
    static wfUyKaa = ['A': 'Ablehnung', 'B': 'Bestellung', 'V': 'Vorvermarktung']
    static wfUy = ['A': 'Ablehnung', 'B': 'Bestellung']
    static wfUyO2 = ['A': 'Ablehnung', 'B': 'Bestellung', 'Y' : 'Gestattung', "S":"Überlastung"]

    public static uepZustandUy = ['0':'0 - Status nicht mehr benutzt', '1':'1 - Cable was planned for the building', '2':'2 - physical cable on property', '3':'3 - Status nicht mehr benutzt', '4': '4 - ÜP ready for service available', '5':'5 - ÜP ready for service but currently no active customer', '6':'6 - like 5 but ÜP physical blocked', '7':'7 - ÜP ready for service and customer active', '8':'8 - Status nicht mehr benutzt']

    // workflow
    public static wfKAA = ['A': 'Ablehnung', 'B': 'Bestellung', 'I': 'Interessent', 'V': 'Vorvermarktung']
    public static wfKAD = ['A': 'Ablehnung', 'B': 'Bestellung', 'I': 'Interessent', 'V': 'Vorvermarktung']
    public static wfKAI =  ["A":"Ablehnung", "B":"Bestellung", "I":"Interessent", "V":"Vorvermarktung", "C":"Bereitstellung unter Vorbehalt"]

    // MAMAS ta_vertrags_code
    public static  contractCode = ['MIT' : 'MIT - Mitnutzung', 'WBA' : 'WBA - Paket Internet/Phone', 'ZIK' : 'ZIK - Zentralinkasso', '405' : '405 - NE4 5 Jahre', '410' : '410 - NE4 10Jahre', '415' : '415 - NE4 15Jahre', 'MOW' : 'MOW - Kabelanschluss Wohnung', 'WOA' : 'WOA - ', 'MDW' : 'MDW - ', 'MHD' : 'MHD - MNV-Wohnung Digital HD', 'WOD' : 'WOD - ', 'WHD' : 'WHD - MNV-Wohnung Digital HD', 'WGA' : 'WGA - Kabelanschluss Wohnung Gewerbliche WE 1:5', 'WGD' : 'WGD - Kabelanschluss Wohnung Gewerbliche WE 1:5 digital', 'GHD' : 'GHD - MNV-Wohnung Digital HD', 'M28' : 'M28 - ', '28D' : '28D - ', '8HD' : '8HD - MNV-Wohnung digital mit 128k', 'M2D' : 'M2D - MNV-Whg. dig. 128k mit Durchschnittspreis, Premium', 'M51' : 'M51 - MNV Wohnung analog mit 512k vorhanden', '51D' : '51D - MNV Wohnung digital mit 512k vorhanden', '5HD' : '5HD - MNV Wohnung digital HD mit 512k vorhanden', 'MAF' : 'MAF - Medienanschluss Familie; Behandlung wie MNV Wohnung Express', 'VVO' : 'VVO - Versorgungsvereinb.', 'VVE' : 'VVE - ', 'VDP' : 'VDP - ', 'VHP' : 'VHP - Digitale HD VVO Premium', 'VDE' : 'VDE - ', 'VHE' : 'VHE - Digitale HD VVO Express', 'ZIB' : 'ZIB - Zentralinkasso Basis', '3MD' : '3MD - NE3 Vertrag mit MMG und Durchleiter', 'HDK' : 'HDK - MNV-Haus Digital HD - Durchleiter', '3DD' : '3DD - Kabelanschluss HausStandard mit MMG digital als Laufzeitvertrag mit Durchleiter', 'HDD' : 'HDD - MNV-Haus Digital HD  - Durchleiter', 'MIN' : 'MIN - MNV Haus Internet', '3MI' : '3MI - NE3-Vertrag mit MMG', '3ML' : '3ML - NE3-Vertrag mit MMG', '3DM' : '3DM - Kabelanschluss Haus-Standard mit MMG digital', 'HDS' : 'HDS - MNV-Haus Digital HD mit MMG', '3DL' : '3DL - Kabelanschluss Haus-Standard mit MMG digital als Laufzeitvertrag', 'HDM' : 'HDM - MNV-Haus Digital HD mit MMG', 'AVO' : 'AVO - Anschlussv. Objekt', 'RDW' : 'RDW - ', 'RAV' : 'RAV - Rahmenvertrag', 'RAH' : 'RAH - ', 'INV' : 'INV - Mehrnutzervertrag', 'GKV' : 'GKV - GK Mehrnutzervertrag', '301' : '301 - NE3 1 Jahr', '303' : '303 - NE3 3 Jahre', '305' : '305 - NE3 5 Jahre', '310' : '310 - NE3 10 Jahre', 'MOH' : 'MOH - Kabelanschluss Haus', 'G5J' : 'G5J - Rahmenvertr. 5 Jahre', 'N3I' : 'N3I - NE3 Indirekt', 'HGA' : 'HGA - Kabelanschluss Haus Gewerbliche WE 1:5 analog', 'H28' : 'H28 - Kabelanschluss Haus mit 128K HSI', 'HGD' : 'HGD - Kabelanschluss Haus Gewerbliche WE 1:5 digital', 'HDG' : 'HDG - MNV-Haus digital HD ', 'IND' : 'IND - Kabelanschluss Haus Standard ohne MMG digital', 'HD3' : 'HD3 - MNV-Haus Digital HD', 'D28' : 'D28 - Kabelanschluss Haus digital mit 128K HSI', 'HD8' : 'HD8 - MNV-Haus digital HD mit 128k', 'MDH' : 'MDH - Kabelanschluss HausStandard ohne MMG digital über Modularvertrag', 'HDO' : 'HDO - MNV-Haus Digital HD', 'H51' : 'H51 - MNV Haus analog mit 512k vorhanden', 'D51' : 'D51 - MNV Haus digital mit 512k vorhanden', 'HD5' : 'HD5 - MNV Haus digital HD mit 512k vorhanden', 'RVI' : 'RVI - Rahmenvertrag Internet', 'EVI' : 'EVI - Einzelnutzervertrag', '4M2' : '4M2 - MMA ENV24', 'AN3' : 'AN3 - ENV', 'KMV' : 'KMV - Kabelmietvertrag', 'KMP' : 'KMP - Kabelmietv. Premium', 'ENA' : 'ENA - Einzelnutzer Alt', 'ENV' : 'ENV - Einzelnutzervertrag', 'EN2' : 'EN2 - ENV 1 Jahresvertrag', 'A24' : 'A24 - KAA24 MonateLaufzeit', '4K2' : '4K2 - ENV 24 Monate', 'AD1' : 'AD1 - 12 Monate Laufzeit', 'N3D' : 'N3D - NE3 Direkt', 'A01' : 'A01 - Digitaler Kabelansch', 'A12' : 'A12 - ', 'A15' : 'A15 - ', 'TRA' : 'TRA - ', 'TRP' : 'TRP - ', 'W12' : 'W12 - Kabelanschluss Wohnung', 'BUN' : 'BUN - 3P Bundle Vertrag', 'MMG' : 'MMG - Multmedia Gestattung', 'STL' : 'STL - Serviceleistung NE3', 'STD' : 'STD - digitaler MNV Haus mit Service vorhanden', 'STV' : 'STV - Serviceleistung', 'SDV' : 'SDV - Serviceleistung', 'STH' : 'STH - Kabelanschluss Service HD', 'GEE' : 'GEE - Grundstückseigentümererklärung', 'MMI' : 'MMI - Internetgestattung Vodafone Enterprise', 'SFV' : 'SFV - Standardfestverbind.', 'KOP' : 'KOP - Kooperationsvertrag', 'BAU' : 'BAU - Baukosten', 'NSI' : 'NSI - Serv. Indirekte Kund', 'DMY' : 'DMY - DMS Vertrag', 'M18' : 'M18 - ÜP Nutzung Markt 18', 'WEX' : 'WEX - Werkvertrag Express', 'UBE' : 'UBE - Testsignal n.ÜP Bau', 'WCL' : 'WCL - Wervertrag Classic', 'SZF' : 'SZF - Zusatzauss. Sat-ZF', 'DIG' : 'DIG - Digi Kabel Endkunde', 'FIA' : 'FIA - Fast Internet Access', 'HSI' : 'HSI - Kabel Highspeed', 'AVW' : 'AVW - Anschlussvereinb. WE', 'D12' : 'D12 - Kabel Digital 12 Mo.', 'D24' : 'D24 - Kabel Digital 24 Mo.', 'D03' : 'D03 - Kabel Digital 3 Mo.', 'D15' : 'D15 - Kabel Digital 15 Mo.', 'T14' : 'T14 - Testabo Home 14 Tage', 'AD2' : 'AD2 - 24 Monate Laufzeit', 'VOP' : 'VOP - Kabel Phone', 'HP1' : 'HP1 - Kabel Phone+Internet', 'NSD' : 'NSD - Service Direkte Kund', 'VOD' : 'VOD - SELECT VIDEO', 'D02' : 'D02 - Kabel Digital', 'BEL' : 'BEL - BrendaENV Erlbaub1WE', 'SKY' : 'SKY - Sky Kooperation', 'HP2' : 'HP2 - Kabel Phone+Internet', 'VIS' : 'VIS - Brenda SAT Digi Kd', 'MML' : 'MML - MultMedGestatt light', 'HSN' : 'HSN - Hotspot Nutzung', 'KHW' : 'KHW - Kaufvertrag Endgerät', 'H12' : 'H12 - Kabel Highspeed', 'V12' : 'V12 - Kabel Phone', 'IPS' : 'IPS - Rückb Filt DKAS DVR', 'VB4' : 'VB4 - NE3 Haus Abklemmpr.', '4S1' : '4S1 - Test DKAS ServPrm DP', 'AIO' : 'AIO - All in One Vodafone', 'CAT' : 'CAT - CAT Verkabelung', 'HBC' : 'HBC - Hotspot Business City', 'HBP' : 'HBP - Hotspot Business Pro', 'HBF' : 'HBF - HBFlex  ', 'MNI' : 'MNI - Internet Basic', 'DUO' : 'DUO - DUO', 'ATV' : 'ATV - TV APP', 'SP1' : 'SP1 - Service Produkte KUD']

    public static salesSegment = ["GK_":"GK_", "KMU":"KMU", "PKV":"PKV", "SMB":"SMB", "WS_":"WS_", "VDF":"VDF"]
    public static ccb1 = ["0":"Kein Kabelanschlussvertrag vorhanden", "A":"MMG vorhanden", "B":"STL / STD vorhanden", "C":"MMI vorhanden"]
    public static ccb2 = ["0":"Kein Kabelanschlussvertrag vorhanden", "A":"MNV-Wohnung vorhanden", "B":"Kein MNV aber ENV-Haus vorhanden", "C":"VV vorhanden", "D":"MNV-Haus am Gebäude vorhanden", "E":"MNV-Haus mit MMG vorhanden", "F":"MNV-Wohnung Basis (ZIB)", "K":"Durchleiter vorhanden", "L":"MNV-Haus Internet am Gebäude vorhanden"]
    public static docsis = ["3.0":"3.0", "3.1":"3.1"]
    public static region = ["R01", "R02", "R03", "R04", "R07", "R09"]

    // MAMAS ta_ref_tv_fiber
    public static tvFiberStatus = ["1":"notPlanned", "2":"areaPlanned", "3":"preMarketing", "4":"underConstruction", "5":"homesPassed", "6":"homesPassedPlus", "7":"homesPrepared", "8":"homesReady", "9":"homesConnected"]

    // UM NE4-Status
    static umNe4Status = ['A':'A - NE4-Ausbauzustand nicht bekannt TK','B':'B - RK-fähiger HVr; Objekt nicht vollständig umgerüstet SI','C':'C - Ausbau beendet:Jede WE Rk-fähig umgerüstet mit MMD 3-Loch SI','D':'D - Ausbau beendet:Jede WE Rk-fähig umgerüstet mit MMD Wisi SI','E':'E - Objekt Rk-fähig ausgebaut mit 862 MHz ohne MMD TK','F':'F - Ausbau beendet:Jede WE Rk-fähig umgerüstet mit MMD 4-Loch SI','G':'G - Sat-Zusatz am ÜP; Breitband ggf. möglich (L4-Prüfung) TK','H':'H - Sat-Zusatz am ÜP; Breitband möglich (nach Prüfung) TK','I':'I - Objekt kompl., 862 MHz o. Dose und Filter SI','J':'J - Objekt teilausb., 862 MHz o. Dose und Filter SI','K':'K - Objekt Einzel, 862 MHz o. Dose und Fiilter TK','M':'M - Sat-Nutzung der NE4; Breitband ggf. möglich (L4-Prüfung) TK','N':'N - Sat-Nutzung der NE4; Breitband möglich (nach Prüfung) TK','O':'O - NE4 mit Querverkabelung durch LWL, BB nicht möglich','R':'R - Marode HVA; BB und DTV ohne Vollausbau nicht möglich','S':'S - Marode HVA, DTV eingeschränkt; BB ohne Vollausbau nicht mögl','T':'T - NE4-Ausbau nicht möglich/vorhanden','U':'U - Sat-Zusatz am ÜP; Breitband nicht möglich (nach Prüfung)','V':'V - 450 MHz Tech; DTV eingeschr.; BB o. Vollausbau nicht mögl. ','W':'W - Objekt komplett ausgebaut mit 862 MHz ohne Rk und MMD','X':'X - Nach Umbau jede WE Rk-fähig TK','Y':'Y - Sat-Nutzung der NE4; keine Dienste möglich (nach Prüfung)','Z':'Z - Sat-Zusatz am ÜP; keine Dienste möglich (nach Prüfung)','0':'0 - ungültige Adresse','2':'2 - Ausbau beendet:mehrere 3 Loch MMDs + passiver Fiber SI','3':'3 - Ausbau beendet:3-Loch MMD + passiver Fiber SI','4':'4 - Ausbau beendet:4-Loch MMD + passiver Fiber SI','5':'5 - Ausbau beendet:3-Loch WisiClik + passiver Fiber SI','6':'6 - Ausbau beendet:4-Loch Homeway + passiver Fiber TK','7':'7 - Ausbau beendet:2-Loch Homeway + passiver Fiber TK','8':'8 - Jede WE im Objekt rückkanalfähig, nicht vollständig umgerüstet','9':'9 - Jede WE im Objekt rückkanalfähig umgerüstet mit 2-Loch MMD']

    static regionUy = [ 'R05', 'R06', 'R08']
    // Vertragssituation UM (GS2-Element); TA_REF_UM_GS2
    static gs2Element = ['AB':'AB - CARRIER: REHNIG BAK MMA-1 MBIT (RÜSSELSHEIM)', 'AK':'AK - CARRIER: PYUR (TCM - DTK) DKA', 'AL':'AL - ALTE LEIPZIGER LEBENSVERSICHERUNG', 'A3':'A3 - CARRIER: K.-P. & B. KERWER GBR', 'BA':'BA - CARRIER: MEDICOM AG', 'BC':'BC - CARRIER: BK-MULTIMEDIA MMA 1 MBIT', 'BE':'BE - CARRIER: BMB VIVAWEST', 'BF':'BF - CARRIER: BERGHAUS DMMA 1 MBIT + 1 FLP', 'BH':'BH - CARRIER: BMB (DRITTBESTAND)', 'BM':'BM - BAUGENOSSENSCHAFT BADEN-BADEN EG', 'BN':'BN - CARRIER: BMB (DRITTBESTAND OHNE BB)', 'BO':'BO - CARRIER: PYUR (TCM MHVA)', 'BS':'BS - CARRIER: BERGHAUS DMMA 1 MBIT', 'BW':'BW - BAUVEREIN WERNE MMA', 'B2':'B2 - PON - MMA 1 MBIT VORVERMARKTUNG', 'B3':'B3 - PON - MMA 6 MBIT VORVERMARKTUNG', 'B4':'B4 - PON - MMA 10 MBIT VORVERMARKTUNG', 'B5':'B5 - PON - MMA 32 MBIT VORVERMARKTUNG', 'B6':'B6 - PON - AV VORVERMARKTUNG', 'B7':'B7 - PON - AV VORVERMARKTUNG INKL. SERVICE', 'CF':'CF - CARRIER: CABLE4 - FH FREIBURG MMA 6 MBIT', 'CL':'CL - CARRIER: CABLE4 - BG LÖRRACH MMA 1 MBIT', 'CS':'CS - CARRIER: CABLE4 - SW BADEN MMA 6 MBIT', 'C4':'C4 - CARRIER: CABLE4 - MMA', 'DK':'DK - PON - ZINK INKL. BOX', 'DS':'DS - IW-KUNDE: MITNUTZUNG', 'DT':'DT - CARRIER: D.T. NET (EX SAT-BESTAND)', 'D1':'D1 - PON - TEILV. VORVERMARKTUNG', 'D2':'D2 - PON - TEILV. INKL. BOX VORVERMARKTUNG', 'EF':'EF - CARRIER: PYUR (TCM) RECONNECT', 'EI':'EI - EISENBAHNER WOGE SCHWERTE', 'EK':'EK - CARRIER: MICHAEL ELLER', 'EM':'EM - CARRIER: PYUR (TCM) SIGNAL', 'ER':'ER - CARRIER: PYUR (TCM) (RECONNECT) MMA 6MBIT HD (PON)', 'ES':'ES - CARRIER: PYUR (TCM) SAT', 'EV':'EV - CARRIER: PYUR (TCM) SAT-AUFBEREITUNG FREI', 'E1':'E1 - CARRIER: FUCHS ELEKTRO-TECHNIK', 'E8':'E8 - CARRIER: ROLLENBECK (KEINE HSI-KOOP)', 'FB':'FB - N/A', 'FH':'FH - CARRIER: FH-SAT GMBH MMA 10 MBIT', 'FI':'FI - FLÜWO BAU + SERVICE GMBH', 'FJ':'FJ - MÜNK & NIERLICH GMBH', 'FK':'FK - CARRIER - VERMARKTUNGSSPERRE', 'FS':'FS - CARRIER: SICOM (FREI FÜR HSI)', 'F3':'F3 - CARRIER: FRANZ PÜTZ & SOHN', 'F4':'F4 - CARRIER: OLAF GUNDLACH', 'GB':'GB - GEM. BAUVEREIN BERGISCHES HEIM', 'GF':'GF - CARRIER: GLASFASER RUHR MMA 6 MBIT', 'GG':'GG - CARRIER: GLASFASER BG HEIMAT BO-STIEPEL MMA 6 MBIT', 'GL':'GL - H.-J. GLAWE GMBH (OHNE AUSBAU)', 'GM':'GM - GEWOBAU ESSEN DMMA 1 MBIT', 'GQ':'GQ - H.-J. GLAWE GMBH', 'GS':'GS - GSWG SENNE DMMA 1 MBIT + FLP', 'GV':'GV - CARRIER: GLASFASER VBW MMA 6 MBIT + GEBÄUDEKONNEKTIVITÄT', 'GW':'GW - DMMA + 1 FLP PILOT', 'G6':'G6 - CARRIER: GELSEN-NET (OHNE AUSBAU)', 'G7':'G7 - CARRIER: GFK OBERHAUSEN', 'G9':'G9 - CARRIER: GELSEN-NET (FREI FÜR HSI)', 'HE':'HE - HAUSVERWALTUNG HEEß-MAIER', 'HH':'HH - N/A', 'HK':'HK - HAUSVERW. KRÄMER GMBH, BRUCHKÖBEL', 'H1':'H1 - CARRIER: IMMOMEDIANET (GWH) HD-MMA 1 MBIT (PON)', 'ID':'ID - CARRIER: PYUR (TCM) UMSCHALTUNG AUF FREMDNETZ', 'IE':'IE - UM HESSEN (FÜR UM NRW GMBH)', 'IM':'IM - CARRIER: IMMOMEDIANET', 'IN':'IN - CARRIER: IMMOMEDIANET (OHNE AUSBAU)', 'IS':'IS - CARRIER: STG', 'KD':'KD - CARRIER: VODAFONE (KABEL DEUTSCHLAND)', 'KE':'KE - KEIM NETZTECHNIK FTTB-PARTNER', 'KH':'KH - K.-H. DIETRICH', 'KK':'KK - N/A', 'KM':'KM - KAUFMÄNNISCH MITVERSORGT', 'KR':'KR - CARRIER: VODAFONE (KDG REGION RHEINLD-PF./SAARLAND)', 'KS':'KS - CARRIER: KP-KABEL (SAT ZF)', 'KT':'KT - CARRIER: TROSCHKE ANTENNEN TECHNIK', 'K5':'K5 - CARRIER: MBG EHEM. KTV MÜLHEIM', 'K6':'K6 - CARRIER: MBG - KTVM (NEU-BESTAND)', 'LE':'LE - LEG SAT ZINK', 'LG':'LG - LEG -NE4- KEINE AUTRÄGE EINGEBEN!!', 'LS':'LS - LEG SPEZIAL MMA 1 MBIT', 'LW':'LW - N/A', 'L2':'L2 - CARRIER: LINZENICH', 'MB':'MB - CARRIER: MBG', 'MC':'MC - CARRIER: MEDICOM DREIEICH (AUßERHALB DREIEICH)', 'MG':'MG - CARRIER: PYUR (TCM) MMA 1 MBIT', 'MK':'MK - CARRIER: MULTIMEDIA-KABEL GMBH', 'MM':'MM - CARRIER: REHNIG (TURLEY AREAL)', 'MO':'MO - MMA OHMSTR.70-74', 'MT':'MT - MTV IMMOBILIEN-VERW. GMBH, BAD SODEN', 'MW':'MW - CARRIER: MYWIRE (FREI FÜR HSI)', 'MY':'MY - CARRIER: MYWIRE (NUR DTV)', 'M1':'M1 - CARRIER: M-GRUPPE (NUR DTV)', 'M2':'M2 - CARRIER: M-GRUPPE (FREI FÜR HSI)', 'M5':'M5 - CARRIER: M-GRUPPE MMA 1 MBIT', 'M7':'M7 - CARRIER: MBG (DKA RV)', 'M8':'M8 - CARRIER: MBG MMA 1 MBIT (WB ESSEN)', 'NA':'NA - CARRIER: NETAACHEN SIGNALANMIETUNG', 'NB':'NB - NETAACHEN - EIGENES NETZ', 'NC':'NC - CARRIER: NETCOLOGNE SIGNALANMIETUNG', 'ND':'ND - CARRIER: NETCOLOGNE (NUR DIGITAL)', 'NE':'NE - NEUE MARLER BG DMMA FLP', 'NF':'NF - CARRIER: NETAACHEN (FREI FÜR HSI)', 'NG':'NG - N/A', 'NH':'NH - NAM KUNDE - HSI VERMARKTUNGSSPERRE', 'NK':'NK - NAM KUNDE - KOMPL. VERMARKTUNGSSPERRE', 'NL':'NL - LEGALFÄLLE: INSTALLATIONSVERBOT LT. LEGAL', 'NM':'NM - CARRIER: NETCOLOGNE (FREI FÜR HSI)', 'NN':'NN - NETCOLOGNE-EIGENES NETZ', 'NO':'NO - NAM KUNDE - HAUSVERBOT', 'NT':'NT - N/A', 'NV':'NV - CARRIER: HSI VERMARKTUNGSSPERRE', 'OH':'OH - HDMMA32MBIT SC ONLY', 'PA':'PA - PADERBORN - DMMA-PLUS', 'PC':'PC - CARRIER: PYUR (TCM - PC) MMA 1 MBIT', 'PK':'PK - CARRIER: PKS GMBH (NUR DTV)', 'PP':'PP - CARRIER: PKS GMBH (FREI FÜR HSI)', 'PQ':'PQ - CARRIER: PYUR (TCM - PEPCOM) SIGNAL', 'PR':'PR - N/A', 'PS':'PS - N/A', 'PT':'PT - N/A', 'PU':'PU - N/A', 'PV':'PV - N/A', 'P1':'P1 - CARRIER: PASCHMANNS (NUR DTV)', 'P2':'P2 - CARRIER: PASCHMANNS (FREI FÜR HSI)', 'P3':'P3 - CARRIER: PASCHMANNS MMA 6 MBIT (GWG VIERSEN)', 'QA':'QA - CARRIER: PYUR (TCM - PC) SIGNAL', 'QB':'QB - CARRIER: PYUR (TCM - PC SIGNAL) NEUSS', 'QC':'QC - CARRIER: PYUR (TCM - PC SIGNAL) SINGEN', 'QD':'QD - CARRIER: PYUR (TCM - PC) SIGNAL WANGEN', 'QE':'QE - N/A', 'QF':'QF - CARRIER: FERNWÄRME TRANSPORTGES. MBH', 'QG':'QG - N/A', 'QH':'QH - CARRIER: PYUR (TCM - PC) SERVICE UM-DEZENTRALE NETZE', 'QI':'QI - N/A', 'QJ':'QJ - CARRIER: PYUR (TCM - PC DTK) MMA 1 MBIT', 'QK':'QK - CARRIER: PYUR (TCM - PC DTK) SIGNAL', 'QL':'QL - CARRIER: PYUR (TCM - PC DTK MHVA)', 'QM':'QM - CARRIER: MEDICOM DREIECH-VERMARKTUNGSSPERRE', 'QN':'QN - N/A', 'QO':'QO - CARRIER: PYUR (TCM - KMS) MMA 1 MBIT', 'QP':'QP - CARRIER: PYUR (TCM - KMS) SIGNAL', 'QQ':'QQ - CARRIER: PYUR (TCM - KCR) SIGNAL', 'QR':'QR - CARRIER: PYUR (TCM - WTC) SIGNAL', 'QS':'QS - CARRIER: PYUR (TCM - MEDIACOM) SIGNAL', 'QT':'QT - N/A', 'QU':'QU - N/A', 'QV':'QV - N/A', 'QW':'QW - N/A', 'QX':'QX - N/A', 'QY':'QY - N/A', 'QZ':'QZ - CARRIER: PYUR (TCM - WTC) RECONNECT', 'Q0':'Q0 - CARRIER: PYUR (TCM - MEDIACOM) RECONNECT', 'Q1':'Q1 - N/A', 'Q2':'Q2 - N/A', 'Q3':'Q3 - CARRIER: CABLE4 - FSB NUR MOBIL', 'Q4':'Q4 - CARRIER: CABLE4 - FREIBURGER STADTBAU', 'Q5':'Q5 - N/A', 'Q6':'Q6 - N/A', 'Q7':'Q7 - N/A', 'Q8':'Q8 - N/A', 'Q9':'Q9 - N/A', 'RA':'RA - CARRIER: REHNIG BAK MMA 6 MBIT', 'RB':'RB - RHEINISCHE BEAMTEN BAUGESELLSCHAFT MBH', 'RC':'RC - CARRIER: REHNIG BAK MMA 32 MBIT', 'RE':'RE - CARRIER: REHNIG BAK MMA 1 MBIT', 'RI':'RI - CARRIER: RIDACOM GMBH MMA 6 MBIT', 'RM':'RM - RHEIN-MAINISCHE AG - MMA', 'RN':'RN - CARRIER: RNT (NUR DTV)', 'RU':'RU - RUHRGEBIET MMA 1 MBIT', 'R1':'R1 - CARRIER: RIDACOM E.K.', 'R2':'R2 - N/A', 'R3':'R3 - CARRIER: REHNIG (FREI FÜR HSI)', 'R5':'R5 - CARRIER: RIDACOM GMBH', 'R9':'R9 - CARRIER: REHNIG BAK MMA 1 MBIT (GSW)', 'SB':'SB - PON - MMA 1 MBIT BK + SAT ANLAGE SERVICE & WARTUNG DURCH UM', 'SC':'SC - PON - MMA 6 MBIT BK+SAT-ZF ANLAGE SERVICE & WARTUNG DURCH UM', 'SD':'SD - SWD MMA 6 MBIT + GEBÄUDEKONNEKTIVITÄT', 'SF':'SF - FREIBURGER STADTBAU-EINZELVERMARKTUNG', 'SG':'SG - CARRIER: STG HAGEN MMA 1 MBIT HD (GWG)', 'SK':'SK - CARRIER: SACHS KABEL SERVICE', 'SN':'SN - STADTNETZ', 'SQ':'SQ - UNITYMEDIA SAT ANLAGE MIT SERVICE UND WARTUNG', 'SR':'SR - PON - DMMA 1 MBIT BK + SAT ANLAGE SERVICE & WARTUNG DURCH UM', 'ST':'ST - CARRIER: STG IMMEO DMMA', 'SU':'SU - SUDHOFF HAUSVERWALTUNG', 'SV':'SV - SAT - VERSORGUNG DURCH NE4 BETREIBER', 'SW':'SW - CARRIER: STG HAGEN MMA 1 MBIT HD (WVH)', 'SX':'SX - CARRIER: SICOM SAT (FREI FÜR HSI)', 'SY':'SY - SAT - VERSORGUNG DURCH EIGENTÜMER', 'S1':'S1 - SWSG - DMMA 1 MBIT INKL. BOX', 'S2':'S2 - CARRIER: ELEKTRO STEVERDING', 'S3':'S3 - STUDIERENDENWERK STUTTGART AöR', 'S4':'S4 - VEREINIGUNG STUTTGARTER STUDENTENWOHNHEIME E.V.', 'TK':'TK - CARRIER: TKS MMA 1 MBIT (BESTAND HES)', 'TM':'TM - CARRIER: TELEMARK', 'TN':'TN - MET MMA 6 MBIT +FLP+HD+HW 3 (BESTAND NH)', 'TR':'TR - MET MMA 6 MBIT +FLP+HD+HW 3 (REST HES)', 'TS':'TS - MET (SAT-VERSORGUNG) SERVICE DURCH UM', 'TT':'TT - MET MMA 6 MBIT +FLP+HD+HW 3 (BESTAND KASSEL)', 'UA':'UA - ALLBAU ESSEN MMA 1 MBIT + FLP', 'U1':'U1 - URBANIA', 'U2':'U2 - N/A', 'U7':'U7 - PON - VERSORGUNGSVEREINBARUNG (UMS BESTAND)', 'VD':'VD - CARRIER: PYUR (TCM -VONOVIA-PC DTK) MMA 1 MBIT', 'VM':'VM - CARRIER: PYUR (TCM -VONOVIA-PC) MMA 1 MBIT', 'VS':'VS - CARRIER: PYUR (TCM -VONOVIA-PC) SIGNAL', 'VT':'VT - CARRIER: PYUR (TCM -VONOVIA-PC DTK) SIGNAL', 'V1':'V1 - CARRIER: GAGFAH', 'V2':'V2 - CARRIER: CABLE 4', 'V3':'V3 - CARRIER: ANTENNENGEM. MÜNCHWEIER', 'V4':'V4 - CARRIER: BK-KABELSERVICE', 'V5':'V5 - CARRIER: DELLMUD ANTENNENBAU', 'V6':'V6 - CARRIER: ELEKTRO BUCK', 'V7':'V7 - CARRIER: ELEKTRO RIEDESSER', 'V8':'V8 - CA_BW_STADT WEINSBERG', 'V9':'V9 - CARRIER: LAMPARTER', 'WA':'WA - WOHNBAU BONN (UM) PON ZINK', 'WD':'WD - WOGE WERDOHL DUALE NE4', 'WG':'WG - N/A', 'WH':'WH - CARRIER: W&H (FREI FÜR HSI)', 'WO':'WO - WG IM KREIS OLPE HD', 'WR':'WR - CARRIER: W&H MMA 1 MBIT + 1 FLP + HW 3 ?', 'WT':'WT - WOHNBAU BONN (KDG UMS) PON ZINK', 'WU':'WU - GWG WUPPERTAL MMA 128 KB (OHNE TELEFONIE)', 'WX':'WX - WV MÜNSTER V.1893 MMA 1 MBIT', 'W0':'W0 - CARRIER: W&H MMA', 'W7':'W7 - CARRIER: WINNEN (FREI FÜR HSI)', 'W8':'W8 - CARRIER: W&H (NUR DTV)', 'W9':'W9 - CARRIER: WINNEN (NUR DTV)', 'X1':'X1 - CARRIER: REHNIG (SERVICEHAUS) (LEERSTAND)', 'X2':'X2 - NETCOLOGNE - SPERRE', 'X3':'X3 - CARRIER: REHNIG (SERVICEHAUS)', 'X4':'X4 - N/A', 'X5':'X5 - CARRIER: STADT TÜBINGEN', 'X6':'X6 - CARRIER: TELEKA', 'X7':'X7 - CARRIER: TKS MMA 1 MBIT (BESTAND BAWÜ)', 'X8':'X8 - CARRIER: HÖR ANTENNENTECHNIK', 'X9':'X9 - CARRIER: D.T. NET SERVICE OHG', 'Y1':'Y1 - CARRIER: AT-SALES GMBH', 'Y2':'Y2 - CARRIER: KABEL SCHEMPP', 'Y4':'Y4 - CARRIER: VODAFONE DEUTSCHLAND GMBH', 'Y5':'Y5 - CARRIER: KSR REDEMANN', 'Y6':'Y6 - N/A', 'Y8':'Y8 - CARRIER: MEDICOM SONNEBERG', 'ZB':'ZB - N/A', 'ZC':'ZC - CARRIER: TELESAT', 'ZE':'ZE - CARRIER: MARIABERG', 'ZF':'ZF - CARRIER: SWU TELENET GMBH', 'ZG':'ZG - CARRIER: REHNIG MMA 1 MBIT + HD (BOSCH WB)', 'ZH':'ZH - CARRIER: ZIEGELMEIER MMA 1 MBIT', 'Z0':'Z0 - CARRIER: TKE GMBH', 'Z1':'Z1 - CARRIER: FH-SAT GMBH', 'Z2':'Z2 - CARRIER: TRÖGER', 'Z3':'Z3 - CARRIER: AUBELE', 'Z5':'Z5 - CARRIER: CA-ANTENNEN- SERVICE', 'Z9':'Z9 - CARRIER: RADIO DURACH', '00':'00 - N/A', '05':'05 - PON - VERTRAGSART PRÜFEN', '09':'09 - ALLBAU (EINZELVERMARKTUNG)', '11':'11 - CARRIER: IMMOMEDIANET (GWH) DMMA 1 MBIT (PON)', '13':'13 - N/A', '15':'15 - PON - ZINK', '16':'16 - PON - ZINKB', '17':'17 - PON - VERSORGUNGSVEREINBARUNG', '18':'18 - PON - AV VOLLVERMARKTUNG', '19':'19 - SERVICE PLUS', '20':'20 - PON - AV TEILVERMARKTUNG', '21':'21 - PON - MMA 128 KB', '22':'22 - PON - MMA 1 MBIT', '23':'23 - CARRIER: MEDICOM DREIEICH (INNERHALB DREIEICH)', '27':'27 - CARRIER: PYUR (TCM) SAT-ZF', '28':'28 - PON - AV VOLLVERMARKTUNG INKL. BOX', '29':'29 - PON - AV TEILVERMARKTUNG INKL. BOX', '33':'33 - CARRIER: UNITYMEDIA BW', '38':'38 - GAT GEMEINSCHAFTS-ANTENNEN-TECHNIK', '44':'44 - DMMA 128 KB', '45':'45 - PON - DMMA 128 KB INKL. BOX', '47':'47 - PON - DMMA 128 KB + 1 FLP INKL. BOX', '49':'49 - PON - DMMA 1 MBIT INKL. BOX', '50':'50 - PON - MMA 6 MBIT', '51':'51 - PON - HD MMA 6 MBIT INKL. BOX', '53':'53 - PON - DMMA 10 MBIT INKL. BOX', '55':'55 - PON - MMA 10 MBIT', '56':'56 - PON - DMMA 1 MBIT SC ONLY', '57':'57 - PON - DMMA 32 MBIT INKL. BOX', '58':'58 - PON - HD MMA 128 KB INKL. BOX', '59':'59 - PON - HD MMA 10 MBIT INKL. BOX', '60':'60 - PON - MMA 32 MBIT', '63':'63 - N/A', '64':'64 - PON - HD-MMA 1 MBIT INKL. BOX', '65':'65 - PON - ZINK HD INKL. BOX', '70':'70 - PON - NE4 SERVICE', '73':'73 - PON - AV TEILVERMARKTUNG + NE4 SERVICE', '75':'75 - PON - AV VOLLVERMARKTUNG + NE4 SERVICE', '77':'77 - PON - AV VOLLVERMARKTUNG INKL. BOX + NE4 SERVICE', '79':'79 - PON - AV TEILVERMARKTUNG INKL. BOX + NE4 SERVICE', '80':'80 - N/A', '81':'81 - N/A', '82':'82 - N/A', '83':'83 - N/A', '84':'84 - N/A', '85':'85 - PON - MMA 20 MBIT', '86':'86 - PON - MMA 50 MBIT', '87':'87 - PON - MMA 100 MBIT', '92':'92 - N/A', '98':'98 - N/A']

    // heading
    static lang = "1"
    static head1 = "Grundeinstellung"
    static head3 = "Technische Parameter"
    static head4 = "Technische Verfügbarkeit"
    static  head5 = "Vertragssituation"

    // label
    static  label1 = "Anschlussvertrag"
    static label2 = "Kundennr."
    static label3 = "Vertragsnr."
    static label4 = "Gestattungsvertrag"
    static label5 = "Umgebung"
    static labelDS = "DS Datenrate"
    static labelUS = "US Datenrate"
    static labelMaxWe = "max. WE"
    static  labelUep = "ÜP-Zustand"
    static labelJaNeinBeides = ['Ja', 'Nein', 'Beides']
    static labelJaNein = ['Ja', 'Nein']
    static labelVertragscode = "Vertragscode"
    static labelBewohnerPlus = "BewohnerPlus"
    static labelDirektVersorgt = "direkt versorgt"
    static labelResults = "Anz. Ergebnisse"
    static labelCoaxFiberBeides = ['Coax', 'Fiber', 'Beides']
    static labelGs2Element = "GS2 Element"
    static labelOxgFiber = "OXG Fiber"

    // placeholder
    static vonBis = ['von', 'bis']

    // Tabelle
    static tHeadId = "VF AdresseID"
    static tHeadUmId = "UM AdresseID"
    static tHeadAdr = "Adresse"
    static tHeadOnkz = "ONKZ"
    static noResult = "keine Daten gefunden"

    // Tooltips
    static ttKaa = "Dienstkategorie Kabelanschluss"
    static ttKad = "Dienstkategorie Kabel Digital"
    static ttKai = "Dienstkategorie Kabel Internet"
    static ttSelfinstall = "Modeminstallation durch Techniker oder durch den Kunden"
    static ttDirektVersorgt = "Objekt hat einen eigenen Übergabepunkt (ÜP) oder wird durch ein Kabel eines anderen Gebäudes mitversorgt"
    static ttMaxWe = "Wohneinheiten im Objekt"
    static ttDsDatenrate = "Downstream Datenrate"
    static ttUsDatenrate = "Upstream Datenrate"
    static ttDocsis = "Übertragungsstandard Internet Kabelnetze"
    static ttUepZustand = "Zustand des Übergabepunktes"
    static ttUmgebung = "Auswahl der Testumgebung"
    static ttFootprint = "Vodafone oder UM Regionen"
    static ttRegion = "Vodafone oder UM Region"
    static ttO2 = "Adressen die Telefonica O2 vermarktet"
    static ttBewohnerPlus = "Adressen mit dem Attribut Mieter Bonus"
    static ttAbk = "Projekt Futurize, abgekemmt"
    static ttGs2 = "Gebäude Segment"

}
