package aakriro

import grails.converters.JSON


// Defining Command Object for search form data
class UserSearchCommand {
    String footprint
    String environment
    String results
    String region
    String o2
    String wfKaa, wfKad, wfKai
    String tvKaa, tvKad, tvKai
    String dsVon, dsBis, usVon, usBis
    String ndpState
    String directlySupplied, selfinstall
    String customerNumber, contractNumber, permissionContract, accessContract, salessegment, contractCode
    String tenantdiscountdKaa, tenantdiscountdKad, tenantdiscountdKai
    String abk, fttb
    // UM contract situation
    String gs2

    static constraints = {
        footprint nullable:false, blank: false, inList:ApiController.getList(Config.company)
        environment nullable:false, blank: false, inList:ApiController.getList(Config.env)
        results nullable:true, blank: true, range:1..1000
        region nullable:true, blank: true, inList:Config.region + Config.regionUy
        o2 nullable:true, blank: true, inList:["J", "N"]
        wfKaa nullable:true, blank: true, inList:ApiController.getList(Config.wfKAA)
        wfKad nullable:true, blank: true, inList:ApiController.getList(Config.wfKAD)
        wfKai nullable:true, blank: true, inList:ApiController.getList(Config.wfKAI) + ApiController.getList(Config.wfUyO2)
        tvKaa nullable:true, blank: true, inList:ApiController.getList(Config.tvKAA) + ApiController.getList(Config.tvUy)
        tvKad nullable:true, blank: true, inList:ApiController.getList(Config.tvKAD) + ApiController.getList(Config.tvUy)
        tvKai nullable:true, blank: true, inList:ApiController.getList(Config.tvKAI) + ApiController.getList(Config.tvUy)
        dsVon nullable:true, blank: true, range:0..999
        dsBis nullable:true, blank: true, range:1..9999
        usVon nullable:true, blank: true, range:0..999
        usBis nullable:true, blank: true, range:1..9999
        ndpState nullable:true, inList:ApiController.getList(Config.uepZustandUy)
        directlySupplied nullable:true, blank: true, inList:["J", "N"]
        selfinstall nullable:true, blank: true, inList:["J", "N"]
        customerNumber  nullable:true, blank: true, range:1..109999999999
        contractNumber  nullable:true, blank: true
        permissionContract nullable:true, blank: true, inList:ApiController.getList(Config.ccb1)
        accessContract nullable:true, blank: true, inList:ApiController.getList(Config.ccb2)
        salessegment nullable:true, blank: true, inList:ApiController.getList(Config.salesSegment)
        contractCode nullable:true, blank: true
        tenantdiscountdKaa nullable:true, blank: true, inList:["J", "N"]
        tenantdiscountdKad nullable:true, blank: true, inList:["J", "N"]
        tenantdiscountdKai nullable:true, blank: true, inList:["J", "N"]
        abk nullable:true, blank: true, inList:["J", "N"]
        fttb nullable:true, blank: true, inList:["C", "F"]
        gs2 nullable:true, blank: true, inList:ApiController.getList(Config.gs2Element)

    }
}
class ApiController{

    // Verknüpfung mit Services
    def adsService
    def adsUyService

    // Map in Liste umwandeln (die keys)
    def static getList(map){
        if(!map) return []
        def list = []
        map.each() {k,v -> list << k}
        return list
    }

    def index(){


        String m, o
        m = "MANDATORY"
        o = "OPTIONAL"
        def data = [:]
        def map = [:]

        def mUri =  [uri:"/api", description: "Overview about parameters and values."]
        def mRes = [resource:"/api/list", description: "List results of given input body."]
        //data.information = [uri:mUri, resource:mRes]
        data.environment = [type:m, values:getList(Config.env), description:ConfigEng.ttUmgebung]
        data.footprint = [type:m, values:getList(Config.company),description:ConfigEng.ttFootprint]
        data.results = [type:o, values:"1-9999", description: "Number of results in response"]
        def mRegion = [valueVF:Config.region, valueUM: Config.regionUy]
        data.region = [type:o + " LIST", values: mRegion, description: ConfigEng.ttRegion]
        data.o2 = [type: o, values: "J/N", description: ConfigEng.ttO2]
        data.wfKAA = [type: o, values: getList(Config.wfKAA), description: "Workflow " + ConfigEng.ttKaa]
        data.wfKAD = [type: o, values: getList(Config.wfKAD), description: "Workflow " + ConfigEng.ttKad]
        data.wfKAI = [type: o, values: getList(Config.wfKAI), description: "Workflow " + ConfigEng.ttKai]
        data.tvKAA = [type: o, values: getList(Config.tvKAA), description: "Technical availability " + ConfigEng.ttKaa]
        data.tvKAA = [type: o, values: getList(Config.tvKAA), description: "Technical availability " + ConfigEng.ttKad]
        data.tvKAA = [type: o, values: getList(Config.tvKAA), description: "Technical availability " + ConfigEng.ttKai]
        data.dsVon = [type: o, description: ConfigEng.ttDsDatenrate]
        data.dsBis  = [type: o, description: ConfigEng.ttDsDatenrate]
        data.usVon = [type: o, description: ConfigEng.ttUsDatenrate]
        data.usBis = [type: o, description: ConfigEng.ttUsDatenrate]
        def mNdpState = [valueVF: getList(Config.uepZustand), valueUM: getList(Config.uepZustandUy)]
        data.ndpState = [type: o, values: mNdpState, description: ConfigEng.ttUepZustand]
        data.directlySupplied = [type: o, values: "J/N", description: ConfigEng.ttDirektVersorgt]
        data.selfinstall = [type: o, values: "J/N", description: ConfigEng.ttSelfinstall]
        data.abk = [type: o, values: "J/N", description: ConfigEng.ttAbk]
        data.fttb = [type: o, values: "C/F", description: "Fiber to the Building. C=Coax, F=Fiber"]
        data.customerNumber = [type: o]
        data.contractNumber = [type: o]
        data.permissionContract = [type: o, values:  getList(Config.ccb1)]
        data.accessContract = [type: o, values: getList(Config.ccb2)]
        data.salessegment = [type: o, values: getList(Config.salesSegment)]
        data.contractCode = [type: o + " LIST", values: getList(Config.contractCode)]
        data.tenantdiscountdKaa = [type:o, values: "J/N", description: ConfigEng.ttBewohnerPlus]
        data.tenantdiscountdKad = [type:o, values: "J/N", description: ConfigEng.ttBewohnerPlus]
        data.tenantdiscountdKai = [type:o, values: "J/N", description: ConfigEng.ttBewohnerPlus]
        data.gs2 = [type: o, values: getList(Config.gs2Element), description: ConfigEng.ttGs2]


        def e1 = """{"environment": "GIT","footprint": "Vodafone Kabel", "results": "2","contractCode":  ["301", "3ML", "405"]}"""
        def e2 = """{"environment": "GIT","footprint": "Vodafone Kabel", "results": "2","wfKai":"B","dsVon":100,"dsBis":500,"usVon":1,"usBis":1000,"ndpState":"7","directlySupplied":"J","selfinstall":"J"}"""
       def mExample = [example1:e1, example2:e2]
        map.information = [uri:mUri] + [resource:mRes] + [methods:"Use POST to request api with a payload. Use GET to request the api with a URL (request-parameters in URL)"] + [examples: mExample]
        map.data = data

        render map as JSON
    }


    def list(UserSearchCommand  searchParams) {
        def result, sqlQuery, noResult

        if (searchParams.hasErrors()) {
            render searchParams.errors as JSON
            return
        }


        // wenn results leer ist, dann wird Standartwert genommen
        if(!searchParams.results) searchParams.results = ""

        // ta_vmbkt_objekt
        def ta_vmbkt_objekt = [:]
        ta_vmbkt_objekt << handleRegion(searchParams.region)
        ta_vmbkt_objekt.a_wsf = searchParams.o2
        ta_vmbkt_objekt.a_uep_zustand = searchParams.ndpState
        ta_vmbkt_objekt.a_uep_im_objekt = searchParams.directlySupplied
        ta_vmbkt_objekt.a_ccb1 = searchParams.permissionContract
        ta_vmbkt_objekt.a_ccb2 = searchParams.accessContract

        // ta_vmbkt_kaa_kad:[wfKaa:A, wfKad:, tvKaa:, tvKad:]
        def ta_vmbkt_kaa_kad = [:]
        ta_vmbkt_kaa_kad.wfKaa = searchParams.wfKaa
        ta_vmbkt_kaa_kad.wfKad = searchParams.wfKad
        ta_vmbkt_kaa_kad.tvKad = searchParams.tvKad
        ta_vmbkt_kaa_kad.tvKad = searchParams.tvKad
        ta_vmbkt_kaa_kad.bpKaa = searchParams.tenantdiscountdKaa
        ta_vmbkt_kaa_kad.bpKad = searchParams.tenantdiscountdKad

        if(searchParams.footprint.equals("Unitymedia") && searchParams.tenantdiscountdKai.equals("J")) {
            // bei Unity ist BewohnerPlus nur unter KAA abgelegt
            ta_vmbkt_kaa_kad.bpKaa = "J"
        }

        //ta_vmbkt_kai:[a_workflow:, a_tv:
        def ta_vmbkt_kai = [:]
        ta_vmbkt_kai.a_workflow = searchParams.wfKai
        ta_vmbkt_kai.a_tv = searchParams.tvKai
        ta_vmbkt_kai.bpKai = searchParams.tenantdiscountdKai

        //ta_vmbkt_transfer_rate:[dsVon:, dsBis:, usVon:, usBis:
        def ta_vmbkt_transfer_rate = [:]
        ta_vmbkt_transfer_rate.dsVon = searchParams.dsVon
        ta_vmbkt_transfer_rate.dsBis = searchParams.dsBis
        ta_vmbkt_transfer_rate.usVon = searchParams.usVon
        ta_vmbkt_transfer_rate.usBis = searchParams.usBis

        // ta_vmbkt_zpk:[sel:J]]
        def ta_vmbkt_zpk = [:]
        ta_vmbkt_zpk.sel = searchParams.selfinstall

        //ta_vmbkt_wizard:[a_ver_1_nummer:, a_kun_1_nummer:, a_vertriebssegment:], ta_vmbkt_zpk:[sel:null]
        def ta_vmbkt_wizard = [:]
        ta_vmbkt_wizard.a_ver_1_nummer = searchParams.contractNumber
        ta_vmbkt_wizard.a_kun_1_nummer = searchParams.customerNumber
        ta_vmbkt_wizard.a_vertriebssegment = searchParams.salessegment

        //wiz_customer_contracts
        def wiz_customer_contracts
        if(searchParams.contractCode) wiz_customer_contracts = searchParams.contractCode.split(",")

        def data =[company:searchParams.footprint, environment:searchParams.environment, results:searchParams.results, ta_vmbkt_objekt:ta_vmbkt_objekt, ta_vmbkt_kaa_kad:ta_vmbkt_kaa_kad, ta_vmbkt_kai:ta_vmbkt_kai, ta_vmbkt_transfer_rate:ta_vmbkt_transfer_rate, ta_vmbkt_zpk:ta_vmbkt_zpk, ta_vmbkt_wizard:ta_vmbkt_wizard, 'wiz_customer_contracts.contract_code':wiz_customer_contracts]

        if(searchParams.footprint == "Vodafone Kabel"){
            (result, sqlQuery) = adsService.findAddresses(data)
        }else{
            (result, sqlQuery) = adsUyService.findAdsUy(data)
        }

        def mSql = [sqlQuery:sqlQuery]
        result.add(mSql)

        if (!result) {
            result = [['OBJEKT_ID': '', 'ADRESSE': 'no data found']]
        }

        if (result == -1) {
            noResult = "A DB-ERROR occured! Please contact your administrator!"
            result = [['OBJEKT_ID': 'ERROR', 'ADRESSE': noResult]]
        }

        render result as JSON

    }




    def handleRegion(String region){
        if(!region) return [a_regionR01:""]  // die Map darf nicht leer sein, sonst funktioniert leftShift nicht
        def lRegion
        def mRegion = [:]

        lRegion = region.split(",")
        for (x in lRegion){
            switch(x){
                case "R01":
                    mRegion.a_regionR01 = x
                    break
                case "R02":
                    mRegion.a_regionR02 = x
                    break
                case "R03":
                    mRegion.a_regionR03 = x
                    break
                case "R04":
                    mRegion.a_regionR04 = x
                    break
                case "R05":
                    mRegion.a_regionR05 = x
                    break
                case "R06":
                    mRegion.a_regionR06 = x
                    break
                case "R07":
                    mRegion.a_regionR07 = x
                    break
                case "R08":
                    mRegion.a_regionR08 = x
                    break
                case "R09":
                    mRegion.a_regionR09 = x
                    break
            }
        }
        return mRegion
    }
}
