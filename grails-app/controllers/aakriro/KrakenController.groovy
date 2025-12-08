package aakriro

import groovy.time.TimeCategory
import org.springframework.context.i18n.LocaleContextHolder

import java.text.SimpleDateFormat

class KrakenController {

    // Verknüpfung mit Services
    def adsService
    def adsUyService


    /**
     *
     * @return params
     */
    def index() {

        def result  // Ergebnis der SQL-Anfrage
        def sqlQuery // SQL SELECT-Statement
        def results // Treffermenge

        // Wert Cookie auslesen, falls vorhanden
        def cLang = getCookieValue('language')

        // TODO prüfen ob obsolet, da in helper.js gehandelt
        def locale = LocaleContextHolder.locale.toString()
        if (cLang == null) cLang = locale.substring(0, 2)

        // Header abhängig vom Wert im language-Cookie
        def head1 = (cLang != 'de') ? ConfigEng.head1 : Config.head1
        def head3 = (cLang != 'de') ? ConfigEng.head3 : Config.head3
        def head4 = (cLang != 'de') ? ConfigEng.head4 : Config.head4
        def head5 = (cLang != 'de') ? ConfigEng.head5 : Config.head5

        // Bezeichnung für Buttons
        def button1 = (cLang != 'de') ? ConfigEng.button1 : Config.button1
        def button2 = (cLang != 'de') ? ConfigEng.button2 : Config.button2

        // Defaultwert für Comboboxen
        def noselect = (cLang != 'de') ? ConfigEng.noSelection : Config.noSelection

        // Werte Panel "Grundeinstellung"
        def env = Config.env
        def company = Config.company
        def region = Config.region

        // Werte Panel "Workflow"
        def wfKaa = (cLang != 'de') ? ConfigEng.wfKAA : Config.wfKAA
        def wfKad = (cLang != 'de') ? ConfigEng.wfKAD : Config.wfKAD
        def wfKai  //= (cLang != 'de') ? ConfigEng.wfKAI : Config.wfKAI

        if (params?.ta_vmbkt_objekt?.a_wsf == 'J') {
            // wenn Footprint == VF und O2, dann A,B,Y
            wfKai = (cLang != 'de') ? ConfigEng.wfUyO2 : Config.wfUyO2
        } else {
            wfKai = (cLang != 'de') ? ConfigEng.wfKAI : Config.wfKAI
        }

        // Werte Panel "Technische Parameter"
        def docsis = Config.docsis
        def umNe4Status = Config.umNe4Status

        // Technische Verfügbarkeit
        def tvKaa = (cLang != 'de') ? ConfigEng.tvKAA : Config.tvKAA
        def tvKad = (cLang != 'de') ? ConfigEng.tvKAD : Config.tvKAD
        def tvKai = (cLang != 'de') ? ConfigEng.tvKAI : Config.tvKAI
        def uepZustand = Config.uepZustand
        def tvFiberStatus = Config.tvFiberStatus

        // Vertragssituation
        def salesSegment = Config.salesSegment
        def ccb1 = Config.ccb1
        def ccb2 = Config.ccb2
        def contractCode = Config.contractCode

        // Vertragssituation UM
        def gs2Element = Config.gs2Element

        // Labels Deutsch, Englisch
        def label1 = (cLang != 'de') ? ConfigEng.label1 : Config.label1
        def label2 = (cLang != 'de') ? ConfigEng.label2 : Config.label2
        def label3 = (cLang != 'de') ? ConfigEng.label3 : Config.label3
        def label4 = (cLang != 'de') ? ConfigEng.label4 : Config.label4
        def label5 = (cLang != 'de') ? ConfigEng.label5 : Config.label5
        def labelDS = (cLang != 'de') ? ConfigEng.labelDS : Config.labelDS
        def labelUS = (cLang != 'de') ? ConfigEng.labelUS : Config.labelUS
        def labelMaxWe = (cLang != 'de') ? ConfigEng.labelMaxWe : Config.labelMaxWe
        def labelUep = (cLang != 'de') ? ConfigEng.labelUep : Config.labelUep
        def labelJaNeinBeides = (cLang != 'de') ? ConfigEng.labelJaNeinBeides : Config.labelJaNeinBeides
        def labelJaNein = (cLang != 'de') ? ConfigEng.labelJaNein : Config.labelJaNein
        def labelVertragscode = (cLang != 'de') ? ConfigEng.labelVertragscode : Config.labelVertragscode
        def labelBewohnerPlus = (cLang != 'de') ? ConfigEng.labelBewohnerPlus : Config.labelBewohnerPlus
        def labelDirektVersorgt = (cLang != 'de') ? ConfigEng.labelDirektVersorgt : Config.labelDirektVersorgt
        def labelResults = (cLang != 'de') ? ConfigEng.labelResults : Config.labelResults
        def labelCoaxFiberBeides = (cLang != 'de') ? ConfigEng.labelCoaxFiberBeides : Config.labelCoaxFiberBeides
        def labelGs2Element = (cLang != 'de') ? ConfigEng.labelGs2Element : Config.labelGs2Element
        def labelOxgFiber = Config.labelOxgFiber


        // placeholder Eingabefelder
        def vonBis = (cLang != 'de') ? ConfigEng.vonBis : Config.vonBis

        // Tabellenkopf
        def tHeadId = (cLang != 'de') ? ConfigEng.tHeadId : Config.tHeadId
        def tHeadUmId = (cLang != 'de') ? ConfigEng.tHeadUmId : Config.tHeadUmId
        def tHeadAdr = (cLang != 'de') ? ConfigEng.tHeadAdr : Config.tHeadAdr
        def tHeadOnkz = (cLang != 'de') ? ConfigEng.tHeadOnkz : Config.tHeadOnkz
        def noResult = (cLang != 'de') ? ConfigEng.noResult : Config.noResult

        // ausgewählter Footprint
        def selectedCompany = params?.company
        switch (selectedCompany) {
        // Werte abhängig vom gewählten Footprint
            case Config.company["Vodafone Kabel"]:
                // VKD
                log.info("Footprint: " + Config.company["Vodafone Kabel"])
                println("Footprint: " + Config.company["Vodafone Kabel"])
                break
            case Config.company["Unitymedia"]:
                // Unity
                log.info("Footprint: " + Config.company["Unitymedia"])
                println("Footprint: " + Config.company["Unitymedia"])
                uepZustand = Config.uepZustandUy
                tvKaa = (cLang != 'de') ? ConfigEng.tvUy : Config.tvUy
                tvKad = (cLang != 'de') ? ConfigEng.tvUy : Config.tvUy
                tvKai = (cLang != 'de') ? ConfigEng.tvUy : Config.tvUy
                wfKaa = (cLang != 'de') ? ConfigEng.wfUyKaa : Config.wfUyKaa
                wfKad = (cLang != 'de') ? ConfigEng.wfUy : Config.wfUy

                if (params?.ta_vmbkt_objekt?.a_wsf == 'J') {
                    wfKai = (cLang != 'de') ? ConfigEng.wfUyO2 : Config.wfUyO2
                } else {
                    wfKai = (cLang != 'de') ? ConfigEng.wfUy : Config.wfUy
                }

                region = Config.regionUy

                break
            default:
                log.info("Kein Footprint gewählt")
                break
        }

        // Tooltips
        def ttKaa = (cLang != 'de') ? ConfigEng.ttKaa : Config.ttKaa
        def ttKad = (cLang != 'de') ? ConfigEng.ttKad : Config.ttKad
        def ttKai = (cLang != 'de') ? ConfigEng.ttKai : Config.ttKai
        def ttSelfinstall = (cLang != 'de') ? ConfigEng.ttSelfinstall : Config.ttSelfinstall
        def ttDirektVersorgt = (cLang != 'de') ? ConfigEng.ttDirektVersorgt : Config.ttDirektVersorgt
        def ttMaxWe = (cLang != 'de') ? ConfigEng.ttMaxWe : Config.ttMaxWe
        def ttDs = (cLang != 'de') ? ConfigEng.ttDsDatenrate : Config.ttDsDatenrate
        def ttUs = (cLang != 'de') ? ConfigEng.ttUsDatenrate : Config.ttUsDatenrate
        def ttDocsis = (cLang != 'de') ? ConfigEng.ttDocsis : Config.ttDocsis
        def ttUepZustand = (cLang != 'de') ? ConfigEng.ttUepZustand : Config.ttUepZustand
        def ttUmgebung = (cLang != 'de') ? ConfigEng.ttUmgebung : Config.ttUmgebung
        def ttFootprint = (cLang != 'de') ? ConfigEng.ttFootprint : Config.ttFootprint
        def ttRegion = (cLang != 'de') ? ConfigEng.ttRegion : Config.ttRegion
        def ttO2 = (cLang != 'de') ? ConfigEng.ttO2 : Config.ttO2
        def ttBewohnerPlus = (cLang != 'de') ? ConfigEng.ttBewohnerPlus : Config.ttBewohnerPlus
        def ttAbk = (cLang != 'de') ? ConfigEng.ttAbk : Config.ttAbk
        def ttGs2 = (cLang != 'de') ? ConfigEng.ttGs2 : Config.ttGs2



        if (params?.search) {
            // Suchen-Button wurde gedrückt
            (result, sqlQuery) = findAddr()

        }

        // Map GUI-Werte
        [tvFiberStatus:tvFiberStatus, labelOxgFiber:labelOxgFiber, umNe4Status:umNe4Status, ttGs2:ttGs2, ttAbk:ttAbk, ttBewohnerPlus: ttBewohnerPlus, ttO2: ttO2, ttRegion: ttRegion, ttFootprint: ttFootprint, ttUmgebung: ttUmgebung, ttUepZustand: ttUepZustand, ttDocsis: ttDocsis, ttUs: ttUs, ttDs: ttDs, ttMaxWe: ttMaxWe, ttDirektVersorgt: ttDirektVersorgt, ttSelfinstall: ttSelfinstall, ttKai: ttKai, ttKad: ttKad, ttKaa: ttKaa, noResult: noResult, tHeadId: tHeadId, tHeadUmId: tHeadUmId, tHeadAdr: tHeadAdr, tHeadOnkz: tHeadOnkz, version: Config.version, labelResults: labelResults, labelDirektVersorgt: labelDirektVersorgt, labelBewohnerPlus: labelBewohnerPlus, labelJaNein: labelJaNein, labelJaNeinBeides: labelJaNeinBeides, labelVertragscode: labelVertragscode, labelUep: labelUep, labelCoaxFiberBeides: labelCoaxFiberBeides, vonBis: vonBis, button1: button1, button2: button2, noselect: noselect, head1: head1, head3: head3, head4: head4, head5: head5, label1: label1, label2: label2, label3: label3, label4: label4, label5: label5, labelMaxWe: labelMaxWe, labelUS: labelUS, labelDS: labelDS, labelGs2Element:labelGs2Element, sqlQuery: sqlQuery, env: env, company: company, region: region, tvKaa: tvKaa, tvKad: tvKad, tvKai: tvKai, uepZustand: uepZustand, wfKaa: wfKaa, wfKad: wfKad, wfKai: wfKai, salesSegment: salesSegment, ccb1: ccb1, ccb2: ccb2, docsis: docsis, contractCode: contractCode, gs2Element:gs2Element, result: result, results: results]


    }

    /**
     *
     * @param cookieName
     * @return Cookie-Wert
     */
    def getCookieValue(cookieName) {
        return request.cookies.find { cookieName == it.name }?.value
    }


    /**
     *
     * @return
     */
    def findAddr() {

        def sdf = new SimpleDateFormat("dd.MM.YYYY'T'HH:mm:ss.sss")
        def date = new Date()
        println "\n" + sdf.format(new Date()) + " " + " Testumgebung: " + params?.environment + " Footprint: " + params?.company
        log.info("Testumgebung: " + params?.environment + "\nFootprint: " + params?.company)


        def result, noResult
        def sqlQuery

        if (params.search && params.environment) {
            if (params.company == Config.company["Unitymedia"]) {
                // Unity
                //println("riro UM params: " + params)
                (result, sqlQuery) = adsUyService.findAdsUy(params)
            } else {
                // VKD
                //println("riro VF params: " + params)
                (result, sqlQuery) = adsService.findAddresses(params)
            }


            if (!result) {

                if (params?.langSwitch == "on") {
                    noResult = "no data found"
                } else {
                    noResult = "keine Daten gefunden"
                }

                result = [['OBJEKT_ID': '', 'ADRESSE': noResult]]
            }

            if (result == -1) {
                noResult = "A DB-ERROR occured! Please contact your admin!"
                result = [['OBJEKT_ID': 'ERROR', 'ADRESSE': noResult]]
            }


        }

        //println  sdf.format(new Date()) + " " + "Anwender: " + System.getProperty("user.name") + sqlQuery + "\n" + result + "\nDie Anfrage dauerte " + TimeCategory.minus(new Date(), date) + "/n"
        println sdf.format(new Date()) + ": " + sqlQuery + "\n" + result + "\nDie Anfrage dauerte " + TimeCategory.minus(new Date(), date) + "/n"
        log.debug(sqlQuery + "\n" + result + "\nDie Anfrage dauerte " + TimeCategory.minus(new Date(), date) + "/n")
        return [result, sqlQuery]


    }

    /**
     *
     * @return
     */
    def init() {
        redirect action: "index"
    }

    /**
     *
     * @return
     */
    def initOnChangeFp() {

        def fp = params.company

        redirect action: "index", params: [company: fp]

    }

    // Methode nicht mehr benutzen!
    // abgelöst durch getPortalUrl(portal, name)
    def getMamasUrl() {
        def url = ""
        def env = ""
        env = params?.environment

        switch (env) {
            case "GIT":
                url = Config.url_git_c_mamas
                break
            case "PNA":
                url = Config.url_pna_c_mamas
                break
            case "3.TEST":
                url = Config.url_3test_c_mamas
                break
            case "4.TEST":
                url = Config.url_4test_c_mamas
                break
        }

        return url
    }

    // MAMAS-Client URLs aus PLE-DB ermitteln
    static String getPortalUri(env, portal, name){
        def dbs = new DbService()
        return dbs.getPortalUrl(env, portal, name)
    }

}
