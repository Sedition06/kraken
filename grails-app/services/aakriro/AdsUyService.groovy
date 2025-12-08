package aakriro

import grails.gorm.transactions.Transactional

@Transactional
class AdsUyService extends AdsService {

    /**
     *
     * @param params
     * @return
     */
    def findAdsUy(params) {

        def result = []
        def sqlQuery, sql, addressIds
        def db = new DbService()


        if (params?.'oxgFiber' == 'J'){
            (addressIds, sqlQuery) = queryTaVmbktFiber(params)
            //println("RIRO addressIDs: " + addressIds)
        }else{
            def dbMamas = db.getDbUrl(params.environment, 'MAMAS', '00')
            sql = db.getDBConnection(dbMamas)
            sqlQuery = createQuery(params, params?.results)
            addressIds = db.executeQuery(sql, sqlQuery)
        }

        if (!addressIds) return [result, sqlQuery]  // kein Ergebnis aus MAMAS -> ADS nicht abfragen

        // ADS-Teil
        def dbAds = db.getDbUrl(params.environment, 'ADS', '00')
        sql = db.getDBConnection(dbAds)
        def sqlQueryAds = queryAds(addressIds, params?.results)
        result = db.executeQuery(sql, sqlQueryAds)

        return [result, sqlQuery + "\n" + sqlQueryAds]


    }

    def queryAds(addressIds, noOfResults) {
        def result = ""
        if (!addressIds || addressIds == -1) return result
        //println("RIRO getClass: " + addressIds.getClass())
        addressIds.A_ADRESSE_ID.each { value -> result = result + ", ${value}" }

        // no. of results
        if (noOfResults == "") noOfResults = Config.maxRows

        result = result.replaceFirst(", ", "")
        result = Config.selectAds + "A_ADRESSE_ID In ($result)" + " And Rownum <= " + noOfResults

        // class org.codehaus.groovy.runtime.GStringImpl
        return result.toString()

    }

    def mapAttributes(params) {

        def paramsUy = [:]

        // 'O2' wurde in GUI ausgewählt ('ta_vmbkt_objekt.a_wsf' == 'J'), wird zu A_WS_GESTATTUNG = 'B'

        // 05.05.2020 RiRo: a_ws_gestattung soll nicht mehr von O2-Checkbox abhänging sein, sondern vom gewählten Workflow
        //paramsUy.put("A_WS_GESTATTUNG ", (params?.'ta_vmbkt_objekt.a_wsf' == 'J') ? 'B' : null)

        // Workflow
        paramsUy.put("A_KV_KABEL_TV", (params?.'ta_vmbkt_kaa_kad.wfKaa' == 'A') ? 'N' : (params?.'ta_vmbkt_kaa_kad.wfKaa' == 'B') ? 'J' : null)
        paramsUy.put("A_KV_DIGITAL_TV", (params?.'ta_vmbkt_kaa_kad.wfKad' == 'A') ? 'N' : (params?.'ta_vmbkt_kaa_kad.wfKad' == 'B') ? 'J' : null)
        // 23.12.2022 AF StephanK Vorvermarktung KAA
        paramsUy.put("A_GEBAEUDE_SEGMENT_2", (params?.'ta_vmbkt_kaa_kad.wfKaa' == 'V') ? "in ( 'B2', 'B3', 'B4', 'B5', 'B6', 'B7')" : null)

        // BewohnerPlus
        //paramsUy.put("A_GEBAEUDE_SEGMENT_2 in (select A_GS2_CODE_ID from TA_REF_UM_GS2 where A_Mieter_Bonus", params?.'ta_vmbkt_kaa_kad.bpKaa')
        //def listRefNe4Status = ['A_SEL_VERFUEGBAR': (params?.'ta_vmbkt_zpk.sel' == 'J') ? 'Y' : (params?.'ta_vmbkt_zpk.sel' == 'N') ? 'N' : null]
        //paramsUy.put("TA_REF_UM_GS2", params?.'ta_vmbkt_kaa_kad.bpKaa')

        if (params?.'ta_vmbkt_objekt.a_wsf' == 'J') {
            // Checkbox 'O2' angeklickt
            //nur wenn Workflow <> 'S'
            paramsUy.put("A_KAI_WOR_VFW ", (params?.'ta_vmbkt_kai.a_workflow' != 'S') ? params?.'ta_vmbkt_kai.a_workflow' : null)
            // wenn Workflow == 'S' dann a_kv_internet='J'   ( 23.12.2022 AF StephanK Überlastung bei UM+O2)
            paramsUy.put("A_KV_INTERNET", (params?.'ta_vmbkt_kai.a_workflow' == 'S') ? 'J' : null)
        } else {
            paramsUy.put("A_KV_INTERNET", (params?.'ta_vmbkt_kai.a_workflow' == 'A') ? 'N' : (params?.'ta_vmbkt_kai.a_workflow' == 'B') ? 'J' : null)
        }

        paramsUy.put("A_UM_MAX_WE", params?.'ta_vmbkt_objekt.a_max_we')
        paramsUy.put("A_UM_MAX_WE_BIS", params?.'ta_vmbkt_objekt.a_max_weBis')

        paramsUy.put("A_KAA_TV", params?.'ta_vmbkt_kaa_kad.tvKaa')
        paramsUy.put("A_KAD_TV", params?.'ta_vmbkt_kaa_kad.tvKad')
        paramsUy.put("A_KAI_TV", (params?.'ta_vmbkt_kai.a_tv' == 'N') ? 'KV' : (params?.'ta_vmbkt_kai.a_tv' == 'J') ? 'TV3' : null)
        paramsUy.put("A_UEP_ZUSTAND", params?.'ta_vmbkt_objekt.a_uep_zustand')
        paramsUy.put("A_ABK_FLAG", params?.'ta_vmbkt_objekt.a_abk_flag')
        paramsUy.put("A_FIBER_COAX_FLAG ", params?.'ta_vmbkt_objekt.a_fiber_coax_flag')

        def listRegions = []
        def list = []
        listRegions.add("'" + params?.'ta_vmbkt_objekt.a_regionR05' + "'")
        listRegions.add("'" + params?.'ta_vmbkt_objekt.a_regionR06' + "'")
        listRegions.add("'" + params?.'ta_vmbkt_objekt.a_regionR08' + "'")

        for (x in listRegions) {
            if (x != "'null'") {
                list.add(x.replace("R0", ""))
            }
        }

        if (!list.isEmpty()) paramsUy.put("A_ORG", list)


        // ta_ref_ne4_status J = Y, ansonsten derzeit nur null-Einträge
        def listRefNe4Status = ['A_SEL_VERFUEGBAR': (params?.'ta_vmbkt_zpk.sel' == 'J') ? 'J' : (params?.'ta_vmbkt_zpk.sel' == 'N') ? 'N' : null]
        paramsUy.put("TA_REF_UM_NE4_STATUS", listRefNe4Status)


        // ta_ref_service_subtype
        def listRefServiceSubtyp = ['A_DTR': params?.'ta_vmbkt_transfer_rate.dsVon', 'A_DTR_BIS': params?.'ta_vmbkt_transfer_rate.dsBis', 'A_UTR': params?.'ta_vmbkt_transfer_rate.usVon', 'A_UTR_BIS': params?.'ta_vmbkt_transfer_rate.usBis', 'A_DOCSIS_VERSION': params?.'ta_vmbkt_objekt.a_docsis']
        paramsUy.put("TA_REF_SERVICE_SUBTYPE", listRefServiceSubtyp)


        paramsUy = cleanMap1(paramsUy, ['', 'null', '*', null])
        // "0" ist ein ÜP-Zustand und darf nicht bereinigt werden
//println "PARAMSUY: " + paramsUy

        return paramsUy


    }


    def helperTaRefServiceSubtype(params) {

        if (!params) return ""

        def result = ""
        params.each { key, value -> result = result + " And ${key} = '${value}'" }

        // email Stephan 24.02.2022
        //result = " And A_SERVICE_SUBTYPE In (Select A_SERVICE_SUBTYPE_ID From TA_REF_UM_SERVICE_SUBTYPE Where" + result + ")"
        //result = result.replace("Where And", "Where ")


        result = result.replace("A_DOCSIS_VERSION", "A_DOCSIS")
        result = result.replace("A_DTR =", "A_DTR_TECHNISCH >=")
        result = result.replace("A_DTR_BIS =", "A_DTR_TECHNISCH <=")
        result = result.replace("A_UTR =", "A_UTR_TECHNISCH >=")
        result = result.replace("A_UTR_BIS =", "A_UTR_TECHNISCH <=")

        return result
    }

    def helperTaRefNe4Status(params) {

        if (!params) return ""

        def result = ""
        params.each { key, value -> result = result + " ${key} = '${value}'" }

        result = " And A_NE4_STATUS In (Select A_NE4_STATUS_ID From NE4.TA_REF_UM_NE4_STATUS Where" + result + ")"
        result = result.replace("Where And", "Where ")
        //result = result.replace("= 'N'", "Is Null")

        return result
    }

    // UM Auswahlbox 'NE4-Status'
    def helperNe4Status(params){
        if (!params) return ""
        def result = ""
        result = " AND A_NE4_STATUS = '" +  params + "'"
    }

    def queryTaVmbktExtra3(params) {

        if (!params) return ""

        // println "queryTaVmbktExtra3(params) 1" + params

        // Map bereinigen
        def listKeyToRemove = Config.keysUy
        listKeyToRemove.each { params.remove(it) }


        def result = ""
        params.each { key, value -> result = result + " And ${key} = '${value}'" }
        result = result.replace("A_UM_MAX_WE =", "A_UM_MAX_WE >=")
        result = result.replace("A_UM_MAX_WE_BIS =", "A_UM_MAX_WE <=")
        result = result.replace("A_ORG = '[", "A_ORG In (")
        result = result.replace("]'", ")")
        result = result.replace("Where And", "Where ")

        return result
    }


    def helperBewohnerPlus(params) {
        if (!params) return ""

        def result = params?.'ta_vmbkt_kaa_kad.bpKaa'
        if (!result) return ""
        result = " And A_GEBAEUDE_SEGMENT_2 In (Select A_GS2_CODE_ID From NE4.TA_REF_UM_GS2 Where A_Mieter_Bonus = '" + result + "')"

        return result
    }

    // 23.12.2022 AF StephanK Überlastung bei UM+O2
    def helperO2Overload(params) {
        if (!params) return ""
        def result = params?.'ta_vmbkt_kai.a_workflow'
        if (!result || result != 'S') return ""
        result = " And delphi.A_Segment in (select a_segment from NE4.TA_SEGMENT_KPI_WOCHE where A_WS_KPI_PT_DS_US = 'R' )"

        return result
    }

    // GS-Element
    def helperGs2(params) {
        if (!params) return ""
        def result = params?.'ta_vmbkt_um_dwh.a_gebaeude_segment_2'
        if (!result) return ""
        result = " And dwh.a_gebaeude_segment_2 = '$result'"
        return result
    }


    def createQuery(params, String noOfResults) {
        def query = """
Select /*+ parallel(${Config.threads}) */
dwh.A_ADRESSE_ID From NE4.ta_vmbkt_um_dwh dwh, NE4.ta_vmbkt_um_delphi delphi
Where dwh.A_ADRESSE_ID = delphi.A_ADRESSE_ID"""

        def paramsUy = mapAttributes(params)
        def subQueryTaRefServiceSubtype = helperTaRefServiceSubtype(cleanMap(paramsUy?.'TA_REF_SERVICE_SUBTYPE'))
        def subQueryTaRefNe4Status = helperTaRefNe4Status(cleanMap(paramsUy.'TA_REF_UM_NE4_STATUS'))
        def ne4Status = helperNe4Status(params?.'ta_ref_um_ne4_status.a_ne4_status')
        def subQueryBewohnerPlus = helperBewohnerPlus(params)
        def extra3 = queryTaVmbktExtra3(paramsUy)
        def subQueryOverload = helperO2Overload(params)
        def subQueryGs2Element = helperGs2(params)
        // no. of results
        if (noOfResults == "") noOfResults = Config.maxRows
        def queryEnd = " And Rownum <= $noOfResults"

        def result = query + extra3 + subQueryTaRefServiceSubtype + subQueryTaRefNe4Status + ne4Status + subQueryBewohnerPlus + subQueryOverload + subQueryGs2Element + queryEnd
        result = result.replace("Where And", "Where")
        // derzeit für Workflow KAA-Vorvermarktung
        result = result.replace("= 'in", "in").replace("')'", "')")

        return result
    }
}
