package aakriro

import grails.gorm.transactions.Transactional
import groovy.sql.Sql

@Transactional
class DbService {
    def dbPle = [url: Config.url_ple, user: Config.user_ple, password: Config.pw_ple, driver: Config.driver_oracle]

    def getDBConnection(String url) {
        log.debug("Start getDBConnection")
        log.debug("DB-Url: " + url)
        println("Start getDBConnection \nDB-Url:" + url)
        try {
            return Sql.newInstance(url)
        } catch (Exception ex) {
            log.error("Fehler beim DB-Verbindungsaufbau: " + ex.getMessage())
            println("Fehler beim DB-Verbindungsaufbau: " + ex.getMessage())
            //System.exit(-1)
        }
    }

    def getDBConnection( url, user, pw, driver) {
        log.debug("Start getDBConnection")
        log.debug("DB-Url: " + url)
        println("Start getDBConnection \nDB-Url:" + url)
        try {
            return Sql.newInstance(url, user, pw, driver)
        } catch (Exception ex) {
            log.error("Fehler beim DB-Verbindungsaufbau: " + ex.getMessage())
            println("Fehler beim DB-Verbindungsaufbau: " + ex.getMessage())
            //System.exit(-1)
        }
    }

    def executeQuery(sql, sqlQuery) {
        //log.debug("Start executeQuery")
        //print("Start executeQuery")
        if (!sql) {
            log.error("DB-Instanz is NULL")
            println("DB-Instanz is NULL")
            return -1
        }

        def rows
        try {
            rows = sql.rows(sqlQuery)
            sql.close()
        } catch (Exception ex) {
            log.error("Fehler beim Ausführen der DB-Abfrage: " + ex.getMessage())
            println("Fehler beim Ausführen der DB-Abfrage: " + ex.getMessage())
        }

        return rows
    }

    // nicht mehr benutzen!
    // durch getDbUrl() abgelöst
    def getUrl(env) {
        def url = [:]

        env = env.toUpperCase()

        switch (env) {
            case "GIT":
                url.put("urlMamas", Config.url_git_mamas)
                url.put("urlAds", Config.url_git_ads)
                url.put("urlWiz1_r01", Config.url_git_wiz1_r01)
                url.put("urlWiz1_r02", Config.url_git_wiz1_r02)
                url.put("urlWiz1_r04", Config.url_git_wiz1_r04)
                url.put("urlWiz2_r03", Config.url_git_wiz2_r03)
                url.put("urlWiz2_r07", Config.url_git_wiz2_r07)
                url.put("urlWiz2_r09", Config.url_git_wiz2_r09)
                break
            case "PNA":
                url.put("urlMamas", Config.url_pna_mamas)
                url.put("urlAds", Config.url_pna_ads)
                url.put("urlWiz1_r01", Config.url_pna_wiz1_r01)
                url.put("urlWiz1_r02", Config.url_pna_wiz1_r02)
                url.put("urlWiz1_r04", Config.url_pna_wiz1_r04)
                url.put("urlWiz2_r03", Config.url_pna_wiz2_r03)
                url.put("urlWiz2_r07", Config.url_pna_wiz2_r07)
                url.put("urlWiz2_r09", Config.url_pna_wiz2_r09)
                break
            case "3.TEST":
                url.put("urlMamas", Config.url_3test_mamas)
                url.put("urlAds", Config.url_3test_ads)
                url.put("urlWiz1_r01", Config.url_3test_wiz1_r01)
                url.put("urlWiz1_r02", Config.url_3test_wiz1_r02)
                url.put("urlWiz1_r04", Config.url_3test_wiz1_r04)
                url.put("urlWiz2_r03", Config.url_3test_wiz2_r03)
                url.put("urlWiz2_r07", Config.url_3test_wiz2_r07)
                url.put("urlWiz2_r09", Config.url_3test_wiz2_r09)
                break
            case "4.TEST":
                url.put("urlMamas", Config.url_4test_mamas)
                url.put("urlAds", Config.url_4test_ads)
                url.put("urlWiz1_r01", Config.url_4test_wiz1_r01)
                url.put("urlWiz1_r02", Config.url_4test_wiz1_r02)
                url.put("urlWiz1_r04", Config.url_4test_wiz1_r04)
                url.put("urlWiz2_r03", Config.url_4test_wiz2_r03)
                url.put("urlWiz2_r07", Config.url_4test_wiz2_r07)
                url.put("urlWiz2_r09", Config.url_4test_wiz2_r09)
                break
        }

        return url
    }

    // für PLE Abfrage entsprechend konvertieren
    def convertEnvToPleEnv(env){
        switch (env) {
            case "GIT":
                break
            case "PNA":
                env = "Prodnah"
                break
            case "3.TEST":
                env = "3. Test"
                break
            case "4.TEST":
                env = "VT4"
                break
        }
        return env
    }

    // SQL Portal Url aus PLE-DB ermitteln
    def getQueryPortal(env, portal, name) {
        // Namen konvertieren, wie in PLE-DB abgelegt
        env = convertEnvToPleEnv(env)
        return """
SELECT 
    a_connection 
FROM 
    ta_v_portal_connections 
WHERE 
    a_portal = $portal 
AND a_kb = $name 
AND a_environment = $env
AND a_region = '00'
"""
    }

    // Portal URL aus PLE-DB ermitteln
    def getPortalUrl(env, portal, name) {
        //def db = new DbService()
        def sql = getDBConnection(dbPle.url, dbPle.user, dbPle.password, dbPle.driver)
        def sqlQuery = getQueryPortal(env, portal, name)
        def result = executeQuery(sql, sqlQuery)
        println("Portal URL: " + result.A_CONNECTION[0])
        return result.A_CONNECTION[0]
    }

    // DB Urls aus PLE-DB ermitteln
    def getDbUrl(env, app, region){
        def db = new DbService()
        def sql = db.getDBConnection(dbPle.url, dbPle.user, dbPle.password, dbPle.driver)
        def sqlQuery = db.getQueryDbUrl(env, app, region)
        def result = db.executeQuery(sql, sqlQuery)
        println("DB URL: " + result.A_CONNECTION[0])
        return result.A_CONNECTION[0]
    }

    // SQL DB Urls aus PLE-DB ermitteln
    def getQueryDbUrl(env, app, region){
        env = convertEnvToPleEnv(env)
        return """
SELECT
    'jdbc:oracle:thin:' || c.a_uid || '/' || c.a_pwd || '@' || c.a_host || ':' || c.a_port || ':' || c.a_sid AS a_connection
FROM
    ta_db_connection c
INNER JOIN
    ta_environment env
ON
    (
        env.a_id = c.a_environment_id)
INNER JOIN
    ta_region reg
ON
    (
        reg.a_id = c.a_region_id)
INNER JOIN
    ta_database b
ON
    (
        b.a_id = c.a_database_id)
INNER JOIN
    ta_database_type t
ON
    (
        t.a_id = b.a_type_id)
WHERE
    env.a_name = $env
AND b.a_name = $app
AND reg.a_name = $region
"""
    }


}
