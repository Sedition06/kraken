package aakriro

import grails.gorm.transactions.Transactional

@Transactional
class AdsService {

    /**
     *
     * @param params
     * @return
     */
    def findAddresses(params) {
        def result = []
        def sqlQuery
        def addressIds
        def sql

        if (params?.'wiz_customer_contracts.contract_code' == '' || params?.'wiz_customer_contracts.contract_code' == null) {
            println("findAddresses: no contract choosen")
            if (params?.'oxgFiber' == 'J'){
                (addressIds, sqlQuery) = queryTaVmbktFiber(params)
            }else{
                (addressIds, sqlQuery) = findAds(params)
            }

        } else {
            println("findAddresses: contract choosen")
            //(result, sqlQuery) = getAddressIdByContract(params)
            (addressIds, sqlQuery) = getAddressIdByContract(params)
        }

        // Neu: AF Stephan 09.09.2024, ONKZ in GUI anzeigen. Dafür Adresse jetzt immer aus ADS ermitteln
        if (!addressIds) return [result, sqlQuery]  // kein Ergebnis aus MAMAS -> ADS nicht abfragen

        def db = new DbService()
        def adsUyService = new AdsUyService()

        // ADS-Teil
        def dbAds = db.getDbUrl(params.environment, 'ADS', '00')
        sql = db.getDBConnection(dbAds)
        def sqlQueryAds = adsUyService.queryAds(addressIds, params?.results)
        result = db.executeQuery(sql, sqlQueryAds)

        return [result, sqlQuery + "\n" + sqlQueryAds]
    }

    /**
     *
     * @param params
     * @return
     */
    def getAddressIdByContract(params) {

        def result = []

        def db = new DbService()
        //def url = db.getUrl(params.environment)

        def regionList = getRegionFromRequest(params)

        def region = 'R01'
        if (regionList.size() > 0) {
            region = regionList[0]
        }

        def wizDbUrl = db.getDbUrl(params.environment, "WIZARD", region.replace("R", ""))

        // Wizard Verbindung
        def sql = db.getDBConnection(wizDbUrl)

        // AF Stepahan Kerwer 19.12.2022: Auswahl mehrerer CCB-Vertragscodes
        def contractList = params?.'wiz_customer_contracts.contract_code'
        def contracts = ""
        if(contractList instanceof java.lang.String){
            // wenn genau 1 Wert ausgewählt, dann String-Klasse
            contracts = "'" + contractList + "'"
        }else{
            // Wenn mehrere Codes ausgewählt sind, dann aneinander ketten
            for (contract in contractList){
                contracts = contracts + "'" + contract + "',"
            }
        }

        if(contracts.contains("',")){
            // das letzte Komma abschneiden
            contracts = contracts.substring(0, contracts.length() -1)
        }

        // SQL Wizard-Anfrage indirekter Vertrag
        def sqlQuery = """
SELECT
    BUILDING_ID As A_Adresse_ID
FROM
    WIZ_ITEM_MDU
WHERE
    CONTRACT_NUMBER IN
    (
        SELECT
            CONTRACT_NUMBER
        FROM
            WIZ_CUSTOMER_CONTRACTS
        WHERE
            CONTRACT_CODE IN ($contracts)
        AND CONTRACT_STATUS = 'AK')
AND rownum <= 100
""".toString()


        // SQL Wizard-Anfrage direkter Vertrag
        def sqlQuery1 = """
SELECT
    BUILDING_ID As A_Adresse_ID
FROM
    WIZ_HP_DESCRIPTION
WHERE
    SERVICE_ADDRESS_ID IN
    (
        SELECT
            SERVICE_ADDRESS_ID
        FROM
            WIZ_CUSTOMER_CONTRACTS
        WHERE
            CONTRACT_CODE IN ($contracts)
        AND CONTRACT_STATUS = 'AK')
AND rownum <= 100
""".toString()


        // Abfrage Adressen in Wizard
        def addressIds = db.executeQuery(sql, sqlQuery)
        def hit = true
        if (!addressIds) {
            // Abfrage auf Tabelle für indirekte Verträge hat keinen Treffer geliefert -> Tabelle für direkte Verträge abfragen
            sqlQuery = sqlQuery1
            addressIds = db.executeQuery(db.getDBConnection(wizDbUrl), sqlQuery)
            if (!addressIds) hit = false
        }

        if (!hit) {
            // kein Ergebnis aus Wizard -> MAMAS nicht abfragen
            return [addressIds, sqlQuery]
        }

        // Verbindung MAMAS
        def dbMamas = db.getDbUrl(params.environment, 'MAMAS', '00')
        sql = db.getDBConnection(dbMamas)

        // Teil-SQL für MAMAS-Anfrage anhand Ergebnis Wizard-Abfrage erstellen
        def sqlPartAddressIs = queryMamasOnAddress(addressIds)

        // Teil-SQL für MAMAS-Anfrage
        def sqlQueryMamas = extractTable(params)

        // Teil-SQLs zu finalen SQL für MAMAS-Anfrage zusammensetzen
        sqlQueryMamas = sqlQueryMamas.replace('Rownum', sqlPartAddressIs + ' And Rownum')

        // Anfrage Adressen in MAMAS
        result = db.executeQuery(sql, sqlQueryMamas)

        // MAMAS-Anfrageergebnis und SQL
        return [result, sqlQuery + "\n" + sqlQueryMamas]


    }

    /**
     * Erstellt Teil-SQL für MAMAS-Anfrage mit Address-IDs
     *
     * @param addressIds
     * @return Teil-SQL
     */
    def queryMamasOnAddress(addressIds) {
        def result = ""

        // wenn keine IDs übergeben wurde, Methode beenden
        if (!addressIds) return result

        // Komma-Separierten Teil-SQL String aus Liste von IDs erzeigen
        addressIds.A_ADRESSE_ID.each { value -> result = result + ", ${value}" }
        result = result.replaceFirst(", ", "")
        result = "A_ADRESSE_ID In (" + result + ")"

        //println "queryMamasOnBuilding(buildingIds) RESULT: " + result
        return result
    }


    /**
     * Region aus params in Liste
     *
     * @param params
     * @return Regions-Liste
     */
    def getRegionFromRequest(params) {
        def lstRegion = []
        // alle Keys die mit ta_vmbkt_objekt.a_regionR0 beginnen und der value nicht null ist -> fürge value zu lstRegion hinzu
        params.each { key, value ->
            if (key.startsWith('ta_vmbkt_objekt.a_regionR0') && value) {
                lstRegion.add(value)
            }
        }
        return lstRegion
    }


    /**
     *
     * @param params
     * @return
     */
    def findAds(params) {
        def db = new DbService()

        // DB-URLs anhand gewähltem Footprint holen
        // Verbindung MAMAS-DB
        def dbMamas = db.getDbUrl(params.environment, 'MAMAS', '00')
        def sql = db.getDBConnection(dbMamas)

        // SQL MAMAS-Anfrage erzeugen
        def sqlQuery = extractTable(params)

        // MAMAS Anfrage ausführen
        def result = db.executeQuery(sql, sqlQuery)

        // Ergebniss MAMAS-Anfrage und SQL
        return [result, sqlQuery]

    }


    // Request-Attribute den Tabellen zuordnen
    def extractTable(params) {
        // neue Map extrahieren, die nur bestimmte Schlüssel enthält
        def paramsExtract = params.subMap(Config.keys)

        // leere Maps für jeweils eine MAMAS-Tabelle
        def paramsTaVmbktObjekt = [:]
        def paramsTaVmbktKaaKad = [:]
        def paramsTaVmbktKai = [:]
        def paramsTaVmbktWizard = [:]
        def paramsTaVmbktTransferRate = [:]
        def paramsTaVmbktZpk = [:]

        // neue Map extrahieren, die nur bestimmte Schlüssel enthält
        //def paramsExtract = params.subMap(Config.keys)

        // Maps befüllen
        paramsTaVmbktObjekt = cleanMap1(paramsExtract.ta_vmbkt_objekt, ['', 'null', '*', null])
        // "0" ist ein ÜP-Zustand und darf nicht bereinigt werden
        paramsTaVmbktKaaKad = cleanMap(paramsExtract.ta_vmbkt_kaa_kad)
        paramsTaVmbktKai = cleanMap(paramsExtract.ta_vmbkt_kai)
        paramsTaVmbktWizard = cleanMap(paramsExtract.ta_vmbkt_wizard)
        paramsTaVmbktTransferRate = cleanMap(paramsExtract.ta_vmbkt_transfer_rate)
        paramsTaVmbktZpk = cleanMap(paramsExtract.ta_vmbkt_zpk)


        // E-Mail Stephan 26.02.2020 -> falls VF + O2, dann TA_VMBKT_KAI.A_WOR_VFW = A oder B oder Y
        def wfKai = queryTaVmbktKai(paramsTaVmbktKai)
        if (params?.ta_vmbkt_objekt?.hasProperty('a_wsf') ){
            // prüfen ob es den Paramaeter a_wsf üerhaupt gibt (API)
            if (params?.ta_vmbkt_objekt?.a_wsf == 'J') {
                // O2 Checkbox gesetzt
                wfKai = wfKai.replace('a_workflow', 'a_wor_vfw')
            }
        }


        // Teil-SQL aus den Maps erzeugen
        def queryWhere = queryTaVmbktObjekt(paramsTaVmbktObjekt) + wfKai + queryTaVmbktKaaKad(paramsTaVmbktKaaKad) + queryTaVmbktWizard(paramsTaVmbktWizard) + queryTaVmbktTransferRate(paramsTaVmbktTransferRate) + queryTaVmbktZpk(paramsTaVmbktZpk)
        queryWhere = queryWhere.replaceFirst('And ', '')
        queryWhere = queryWhere.trim().replaceAll("\\s{2,}", " ")
        queryWhere = queryWhere.replace("Where ) And", "Where")
        queryWhere = queryWhere.replace("Where And", "Where")

        // finales SQL für MAMAS-Anfrage
        return query(queryWhere, params?.results)

    }


    /**
     * SQL-String zusammensetzen
     *
     * @param queryWhere
     * @return
     */
    def query(queryWhere, String noOfResults) {

        // SELECT Teil-Querry
        def result = Config.selectMamasAds
        result = result.replace("ADS.", "NE4.")

        // no. of results
        if (noOfResults == "") noOfResults = Config.maxRows

        // Teil-Querry
        def queryEnd = " And Rownum <= " + noOfResults
        if (queryWhere == "") queryEnd = " Rownum <= " + noOfResults

        // Teil-Querries zusammensetzen
        result = result + queryWhere + queryEnd

        // finale SQL-Querry
        return result
    }


    /**
     * TA_VMKT_OBJEKT
     *
     * @param params
     * @return
     */
    def queryTaVmbktObjekt(params) {

        if (!params) return ""

        // aktivierte Regionen ermitteln
        def regionStr = getRegion(params)
        //println "RIRO queryTaVmbktObjekt.regionStr: " + regionStr

        //maxWe
        def resultMWB = ""

        if (params.a_max_weBis) {
            //maxWeBis.put("a_max_we", params.a_max_weBis)
            resultMWB = " And a_max_we <= " + params.a_max_weBis
            params.remove('a_max_weBis')
        }

        def result = ""
        params.each { key, value -> result = result + "And ${key} = '${value}' " }

        result = result.replaceFirst('And ', '')


        result = " And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_OBJEKT Where $result $resultMWB $regionStr)"
        result = result.replace('a_max_we = ', 'a_max_we >= ')
        result = result.replace(' Where  And ', ' Where ')


        return result
    }


    /**
     * TA_VMBKT_KAI
     *
     * @param params
     * @return
     */
    def queryTaVmbktKai(params) {

        if (!params) return ""

        def bpKai = ""
        def blnBbKai = false

        if (params.containsKey('bpKai')) {
            bpKai = "'" + params.bpKai + "'"
            blnBbKai = true
            params.remove('bpKai')

        }

        def result = ""
        params.each { key, value -> result = result + " And ${key} = '${value}'" }

        if (blnBbKai) {
            def query
            def bpTrue = "OR A_ADRESSE_ID In (SELECT A_ADRESSE_ID FROM NE4.TA_VMBKT_OBJEKT WHERE A_CCB2 in ('A','C','F','L','E','D')"
            if (bpKai == "'N'") {
                query = """
 And (A_MBO_FLAG_KAN_GRP IN
    (
        SELECT
            A_KANAL_GRUPPE_ID
        FROM
            NE4.TA_KANAL_GRUPPE
        WHERE
            A_PUB = $bpKai)
Or A_MBO_FLAG_KAN_GRP IS NULL)
"""
            } else {
                query = """
 And (A_MBO_FLAG_KAN_GRP IN
    (
        SELECT
            A_KANAL_GRUPPE_ID
        FROM
            NE4.TA_KANAL_GRUPPE
        WHERE
            A_PUB = $bpKai)
)
$bpTrue )
"""
            }

            result = result + query
        }

        result = result.replaceFirst('And ', '')


        result = " And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_KAI Where $result)"
        result = result.replace("Where   ) And", "Where")

        log.info("queryTaVmbktKai(params): " + result)

        return result

    }

    /**
     * TA_VMBKT_KAA_KAD
     *
     * @param params
     * @return
     */
    def queryTaVmbktKaaKad(params) {

        if (!params) return ""

        def dikaKaa = " And A_DIENSTKATEGORIE = 'KAA') "
        def dikaKad = " And A_DIENSTKATEGORIE = 'KAD') "

        def paramsKaa = [:] // separate Map für KAA
        def paramsKad = [:] // seperate Map für KAD

        def blnBbKaa = false
        def blnBbKad = false
        def bpKaa = ""
        def bpKad = ""

        // BewohnerPlus KAA
        if (params.containsKey('bpKaa')) {
            bpKaa = "'" + params.bpKaa + "'"
            blnBbKaa = true
            params.remove('bpKaa')

        }

        // BewohnerPlus KAD
        if (params.containsKey('bpKad')) {
            bpKad = "'" + params.bpKad + "'"
            blnBbKad = true
            params.remove('bpKad')

        }

        if (params.containsKey('tvKaa')) {
            paramsKaa.put('a_tv', params.tvKaa + "'" + dikaKaa)
            params.remove('tvKaa')

        }

        if (params.containsKey('tvKad')) {
            paramsKad.put('a_tv_kad', params.tvKad + "'" + dikaKad)
            params.remove('tvKad')

        }

        if (params.containsKey('wfKaa')) {
            paramsKaa.put('a_workflow', params.wfKaa + "'" + dikaKaa)
            params.remove('wfKaa')

        }

        if (params.containsKey('wfKad')) {
            paramsKad.put('a_workflow_kad', params.wfKad + "'" + dikaKad)
            params.remove('wfKad')

        }


        def result = ""
        def resultKaa = ""
        def resultKad = ""
        def bpTrue = "OR A_ADRESSE_ID In (SELECT A_ADRESSE_ID FROM NE4.TA_VMBKT_OBJEKT WHERE A_CCB2 in ('A','C','F','L','E','D')"

        if (blnBbKaa) {
            if (bpKaa == "'N'") {
                // BewohnerPlus KAA == 'Nein'
                result = result + """
And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_KAA_KAD Where
(A_MBO_FLAG_KAN_GRP IN
    (
        SELECT
            A_KANAL_GRUPPE_ID
        FROM
            NE4.TA_KANAL_GRUPPE
        WHERE
            A_PUB = $bpKaa) $dikaKaa
Or (A_MBO_FLAG_KAN_GRP IS NULL $dikaKaa)
"""
            } else {
                result = result + """
And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_KAA_KAD Where
(A_MBO_FLAG_KAN_GRP IN
    (
        SELECT
            A_KANAL_GRUPPE_ID
        FROM
            NE4.TA_KANAL_GRUPPE
        WHERE
            A_PUB = $bpKaa) $dikaKaa
$bpTrue $dikaKaa )

"""
            }

        }

        if (blnBbKad) {
            if (bpKad == "'N'") {
                // BewohnerPlus KAD == 'Nein'
                result = result + """
And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_KAA_KAD Where
(A_MBO_FLAG_KAN_GRP IN
    (
        SELECT
            A_KANAL_GRUPPE_ID
        FROM
            NE4.TA_KANAL_GRUPPE
        WHERE
            A_PUB = $bpKad) $dikaKad
Or (A_MBO_FLAG_KAN_GRP IS NULL $dikaKad)
"""
            } else {
                result = result + """
And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_KAA_KAD Where
(A_MBO_FLAG_KAN_GRP IN
    (
        SELECT
            A_KANAL_GRUPPE_ID
        FROM
            NE4.TA_KANAL_GRUPPE
        WHERE
            A_PUB = $bpKad) $dikaKad
$bpTrue $dikaKad )
"""
            }

        }


        if (paramsKaa) {
            paramsKaa.each { key, value -> resultKaa = resultKaa + " And ${key} = '${value}'" }
            result = result + " And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_KAA_KAD Where $resultKaa)"
        }

        if (paramsKad) {
            paramsKad.each { key, value -> resultKad = resultKad + " And ${key} = '${value}'" }
            result = result + " And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_KAA_KAD Where $resultKad)"
        }

        if (params) {
            params.each { key, value -> result = result + " And ${key} = '${value}'" }
            result = result + " And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_KAA_KAD Where $result)"
        }

        //result = result.replaceFirst('And ', '')
        result = result.replace('a_tv_kad', 'a_tv')
        result = result.replaceAll('a_tv', '(a_tv')
        result = result.replace('a_workflow_kad', 'a_workflow')
        result = result.replace('a_workflow', '(a_workflow')
        result = result.replace(") '", ")")
        result = result.replace("Where  And", "Where ")

        log.info("queryTaVmbktKaaKad(params): " + result)
        return result
    }


    /**
     * TA_VMBKT_WIZARD
     *
     * @param params
     * @return
     */
    def queryTaVmbktWizard(params) {

        if (!params) return ""

        def result = ""
        params.each { key, value -> result = result + " And ${key} = '${value}'" }

        result = result.replaceFirst('And ', '')
        result = " And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_WIZARD Where $result)"

        //println "queryTaVmbktWizard(params): " + result

        return result

    }


    /**
     * TA_VMBKT_TRANSFER_RATE
     *
     * @param params
     * @return
     */
    def queryTaVmbktTransferRate(params) {

        if (!params) return ""

        def utr = " And A_TRR_TYP = 'UTR') "
        def dtr = " And A_TRR_TYP = 'DTR') "


        def paramsUs = [:]
        def paramsDs = [:]

        if (params.containsKey('dsVon')) {
            paramsDs.put('a_ds', params.dsVon + "'$dtr")
            params.remove('dsVon')

        }

        if (params.containsKey('dsBis')) {
            paramsDs.put('a_ds1', params.dsBis + "'$dtr")
            params.remove('dsBis')

        }

        if (params.containsKey('usVon')) {
            paramsUs.put('a_us', params.usVon + "'$utr")
            params.remove('usVon')

        }

        if (params.containsKey('usBis')) {
            paramsUs.put('a_us1', params.usBis + "'$utr")
            params.remove('usBis')

        }


        def result = ""
        def resultDs = ""
        def resultUs = ""

        if (paramsDs) {
            paramsDs.each { key, value -> resultDs = resultDs + " And ${key} = '${value}'" }
            result = result + " And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_TRANSFER_RATE Where $resultDs)"
        }

        if (paramsUs) {
            paramsUs.each { key, value -> resultUs = resultUs + " And ${key} = '${value}'" }
            result = result + " And A_Adresse_ID IN (Select A_Adresse_ID From NE4.TA_VMBKT_TRANSFER_RATE Where $resultUs)"
        }

        if (params) {
            params.each { key, value -> result = result + " And ${key} = '${value}'" }
            result = result + " And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_TRANSFER_RATE Where $result)"
        }


        //result = result.replaceFirst('And ', '')
        result = result.replace('a_ds =', '(A_TRR_MAMAS >=')
        result = result.replace('a_ds1 =', '(A_TRR_MAMAS <=')
        result = result.replace('a_us =', '(A_TRR_MAMAS >=')
        result = result.replace('a_us1 =', '(A_TRR_MAMAS <=')
        result = result.replace(") '", ")")
        result = result.replace("Where  And", "Where ")


        // println "queryTaVmbktTransferRate(params): " + result

        return result

    }


    /**
     * TA_VMBKT_ZPK
     *
     * @param params
     * @return
     */
    def queryTaVmbktZpk(params) {

        if (!params) return ""

        def vod = " And A_ZUS_PROD_KAT = 'VOD')"
        def sel = " And A_ZUS_PROD_KAT = 'SEL')"

        def paramsVod = [:]
        def paramsSel = [:]

        if (params.containsKey('vod')) {
            paramsVod.put('a_tv', params.vod + "'$vod")
            params.remove('vod')
        }

        if (params.containsKey('sel')) {
            paramsSel.put('a_tv_sel', params.sel + "'$sel")
            params.remove('sel')
        }


        def result = ""
        def resultVod = ""
        def resultSel = ""

        if (paramsVod) {
            paramsVod.each { key, value -> resultVod = resultVod + " And ${key} = '${value}'" }
            result = result + " And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_ZPK Where $resultVod)"
        }

        if (paramsSel) {
            paramsSel.each { key, value -> resultSel = resultSel + " And ${key} = '${value}'" }
            result = result + " And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_ZPK Where $resultSel)"
        }

        if (params) {
            params.each { key, value -> result = result + " And ${key} = '${value}'" }
            result = result + " And A_Adresse_ID In (Select A_Adresse_ID From NE4.TA_VMBKT_ZPK Where $result)"
        }


        //result = result.replaceFirst('And ', '')
        result = result.replace("')')", "')")
        result = result.replace("Where  And", "Where")
        result = result.replace("a_tv_sel", "a_tv")


        //println "queryTaVmbktZpk(params): " + result

        return result

    }


    /**
     *
     * @param map
     * @return Map ohne Werte valToClean
     */
    def cleanMap(map) {

        if (map == null) return

        // zu bereinigende Werte - TODO evtl in Config auslagern
        def valToClean = ['', 'null', '*', '0', null]

        // Map um Werte aus Liste valToClean bereinigen
        for (x in valToClean) {
            map = map - map.findAll { it.value == x }
        }

        return map
    }

    def cleanMap1(map, valToClean) {

        if (map == null) return

        // zu bereinigende Werte - TODO evtl in Config auslagern
        //def valToClean = ['', 'null', '*', null]

        // Map um Werte aus Liste valToClean bereinigen
        for (x in valToClean) {
            map = map - map.findAll { it.value == x }
        }

        return map
    }


    def queryBewohnerPlus(params) {

        if (!params) return ""

        def table = "TA_VMBKT_KAA_KAD"
        def dika = "KAA"
        def pub = "N"
        def result = ""

        def sqlQuery

        for (x in params) {
            //println "BP2: " + x
            //println "BP2 key: " + x.key
            //println "BP2 value: " + x.value

            if (x.key == "bpKai") {
                table = 'TA_VMBKT_KAI'
            }
            if (x.key == "bpKad") {
                dika = "KAD"
            }
            if (x.value == "J") {
                pub = "J"
            }

            sqlQuery = """
SELECT
    A_ADRESSE_ID
FROM
    $table
WHERE
    A_Dienstkategorie = $dika
AND A_MBO_FLAG_KAN_GRP IN
    (
        SELECT
            A_KANAL_GRUPPE_ID
        FROM
            NE4.TA_KANAL_GRUPPE
        WHERE
            A_PUB = $pub)
    """
            result = result + sqlQuery
        }

        /*
         if (params) {
             params.each { key, value -> result = result + " And ${key} = '${value}'" }
             result = result + " And A_Adresse_ID In (Select A_Adresse_ID From TA_VMBKT_KAA_KAD Where $result)"
         }

         */

        //println "BP Query:  " + result
        return result
    }


    /**
     * TA_VMBKT_FIBER
     *
     * @param params
     * @return
     */
    def queryTaVmbktFiber(params){
        def regionList = []
        def result = []
        def fiberStatus = ""
        def regionStr = ""
        def queryPart = ""
        def regionOrStatus = false

        regionList << extractRegionValues(params.ta_vmbkt_objekt)
        regionStr = regionList[0].findAll { it.startsWith('R0') }.collect { it[2..-1] }.join(', ')
        // Unterscheidung zwischen Footprints bzgl. Region nötig, falls keine Region ausgewählt wurde
        if(regionStr.isEmpty() &&  params.company == Config.company["Unitymedia"]){
            regionStr = "5, 6, 8"
        } else if(regionStr.isEmpty() &&  params.company != Config.company["Unitymedia"]){
            regionStr = "1, 2, 3, 4, 7, 9"
        }

        if(regionStr != ""){
            regionOrStatus = true
            regionStr = " A_Org In (" + regionStr + ")"
        }
        fiberStatus = params.ta_vmbkt_fiber

        if(fiberStatus != ""){
            regionOrStatus = true
            fiberStatus = " And A_TV_FIBER = " + fiberStatus
        }

        if(regionOrStatus){
            queryPart = fiberStatus + " And " + regionStr
        }

        def db = new DbService()
        // Verbindung MAMAS
        def dbMamas = db.getDbUrl(params.environment, 'MAMAS', '00')
        def sql = db.getDBConnection(dbMamas)

        def query = "Select A_Adresse_ID From NE4.TA_VMBKT_FIBER Where" + queryPart +  " And Rownum <= 100"
        query = query.replace("Where And", "Where").replace("And And", "And").replace("And  And", "And")

        // Anfrage Adressen in MAMAS
        result = db.executeQuery(sql, query)

        // MAMAS-Anfrageergebnis und SQL
        return [result, query]
    }


    def extractRegionValues(map) {
        def regionValues = []
        map.each { key, value ->
            if (key.startsWith('a_region') && value) {
                regionValues << value
            }
        }
        return regionValues
    }

    /**
     * getRegion
     *
     * @param params
     * @return SQL part for region request
     */
    def getRegion(params){
        def regionStr = ""

        // TODO Regionsermittlung prüfen ob durch getRegionFromRequest ersetzt werden kann (müßte um Unity-Regionen erweitert werden)
        def regionList = []
        def map = [:]
        map << params

        for (x in map) {
            if (x.key.startsWith('a_region')) {
                regionList.add(x.value)
                params.remove(x.key)
            }
        }

        if (regionList) {
            // Liste von Regionen wurde erstellt
            // Teil-Querry für Regionsfilter erstellen
            regionStr = "And A_REGION In "
            regionList.each { regionStr = regionStr + ", '${it}'" }
            regionStr = regionStr.replaceFirst(",", "(")
            regionStr = regionStr + ")"
        }

        return regionStr
    }
}
