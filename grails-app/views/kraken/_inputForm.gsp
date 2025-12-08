<%@ page import="aakriro.Config" %>
<%@ page import="aakriro.KrakenController" %>

<div class="container" style="width:${Config.widthContainer}">

    <nav class="navbar sticky-top navbar-light" style="background-color: #ffb3b3; width:${Config.widthContainer}"
         title="This page is optimized for browsers with Chromium engine.">

        <table class="table-borderless" style="width:${Config.widthContainer}">
            <tbody>
            <tr>
                <td rowspan="2">
                    <a class="navbar-brand" href="#"  >
                        <asset:image src="akk/logo_kraken2.png" alt="KRAKEN Logo" id="logo" width="301" height="102"/>
                    </a>
                </td>

                <td style="width:110px">
                    <div class="flag-right">
                        <g:img dir="images" file="akk/flag_germany.png" width="20" height="20"/>
                    </div>
                </td>
                <td style="width:50px">
                    <div class="flag-right1">
                        <fieldset>
                            <div class="col text-right">
                                <div class="custom-control custom-switch">
                                    <input type="checkbox" class="custom-control-input" id="langSwitch"
                                           name="langSwitch"
                                           onchange="switchLanguage('langSwitch', 'index')">
                                    <label class="custom-control-label" for="langSwitch">
                                        <g:img dir="images"
                                               file="akk/flag_united_kingdom.png"
                                               width="20" height="20"/>
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </td>
            </tr>
            <tr>
                <td colspan="2" rowspan="2" style="height:91px">
                    <!-- Spinner /-->
                    <div id="spinner" class="spinner" style="display:none; text-align: center">
                        <div class="spinner-border text-success"></div>
                    </div>
                    <br><br>
                    <fieldset class="buttons bottom-right">
                        <!-- MAMAS-URL -->
                        <g:if test="${params.environment?.trim()}">
                        <%-- envionment ist nicht NULL und kein Leerstring --%>
                            <a href="${KrakenController.getPortalUri(params.environment, "MAMAS", "Webclient")}"
                               target="_blank" style="font-size: small">MAMAS</a>
                        </g:if>

                        <!-- API-URL -->
                        <a href="/api" target="_blank" style="font-size: small">API</a>

                        <g:submitButton class="btn btn-success" name="search"
                                        value="${button1}"/>  <!-- Suchen Button-->
                    <%--g:actionSubmit class="btn btn-outline-primary" value="Initialisieren" action="init"/--%>
                        <button class="btn btn-primary"
                                onclick="initInput()">${button2}</button>   <!-- Initialisieren Button-->
                    </fieldset>
                </td>
            </tr>

            <tr>
                <td>
                    <!-- Versionshinweis -->
                    <span class="align-bottom"
                          style="font-size:10px">Version: ${version}</span>
                </td>
            </tr>
            </tbody>
        </table>
    </nav>

    <!-- easteregg -->
    <g:img dir="images" file="akk/ebc_s_r.png" id="ebc" style="display:none; position:fixed; z-index:1000;"/>



    <!-- Grundeinstellungen -->
    <table class="table-borderless table-danger table-sm border-bottom" style="width:${Config.widthContainer}">
        <thead>
        <tr>
            <th colspan="4" class="clickable " data-toggle="collapse" data-target="#group-of-rows-0"
                aria-expanded="false"
                aria-controls="group-of-rows-0">
                <h3>${head1}</h3>
            </th>
        </tr>
        </thead>
        <tbody id="group-of-rows-0" class="collapse show">
        <tr class="d-flex">
            <th class="col-2" title="${ttUmgebung}">
                <label class="my-1 mr-2" for="environment">${label5}</label>
            </th>
            <td>
                <!-- Testumgebung auswählen -->
                <g:select required="required"
                          name="environment"
                          noSelection="${noselect}"
                          from="${env}"
                          optionKey="key"
                          optionValue="value"
                          value="${params?.environment}"
                          onchange="submit()"
                          style="width: ${Config.width}"/>
            </td>

            <th class="col-2" title="${ttFootprint}"><label class="my-1 mr-2" for="company">Footprint</label></th>
            <td class="col-4">
                <!-- Footprint auswählen -->
                <g:select required="required"
                          name="company"
                          noSelection="${noselect}"
                          from="${company}"
                          optionKey="key"
                          optionValue="value"
                          value="${params?.company}"
                          onchange="clearRegions();submit()"
                          style="width: ${Config.width}"/>
            </td>
        </tr>
<!--  2te Zeile  -->
         <tr class="d-flex">
            <th class="col-2" title="${ttRegion}"><label class="my-1 mr-2">Region</label></th>
            <td colspan="2" class="col-6">
                <g:each in="${region}">
                    <label for="ta_vmbkt_objekt.a_region${it}">${it}</label>
                    <g:checkBox
                        name="ta_vmbkt_objekt.a_region${it}"
                        value="${it}"
                        checked="${it == params.ta_vmbkt_objekt?.get('a_region' + it)}"
                        style="margin-right: 10px"/>
                </g:each>
                <label for="ta_vmbkt_objekt.a_regionalle">alle</label>
                <g:checkBox
                    name="ta_vmbkt_objekt.a_regionalle"
                    value="alle"
                    checked="${'alle' == params?.'ta_vmbkt_objekt.a_regionalle'}"
                    onclick="setRegions()"/>
            </td>
        </tr>
        <tr class="d-flex">
            <th class="col-2"><label class="my-1 mr-2" for="results">${labelResults}</label></th>
            <td class="col-4">
                <g:field
                    type="number"
                    min="1"
                    max="100"
                    name="results"
                    value="${params?.'results'}"
                    placeholder="${Config.maxRows}"
                    style="width:${Config.width}"/>
            </td>
            <td class="col-1.5" title="${ttO2}">
                <!-- O2 Checkbox -->
                <label for="ta_vmbkt_objekt.a_wsf"><b>O2</b></label>
                <g:checkBox
                    name="ta_vmbkt_objekt.a_wsf"
                    value="J"
                    checked="${'J' == params?.'ta_vmbkt_objekt.a_wsf'}"
                    onchange="submit()"
                    disabled="${'J' == params?.bewohnerPlus || 'J' == params?.oxgFiber}"/>
            </td>
            <td class="col-1.5 title="${ttBewohnerPlus}">
                <!-- BewohnerPlus Checkbox -->
                <label for="bewohnerPlus"><b>${labelBewohnerPlus}</b></label>
                <g:checkBox
                    name="bewohnerPlus"
                    value="J"
                    checked="${'J' == params?.bewohnerPlus}"
                    onchange="submit()"
                    disabled="${'J' == params?.'ta_vmbkt_objekt.a_wsf' || 'J' == params?.oxgFiber}"/>
            </td>
            <td class="col-1.5" title="${labelOxgFiber}">
                <!-- OXG Fiber Checkbox -->
                <label for="oxgFiber"><b>${labelOxgFiber}</b></label>
                <g:checkBox
                    name="oxgFiber"
                    value="J"
                    checked="${'J' == params?.oxgFiber}"
                    onchange="submit()"
                    disabled="${'J' == params?.'ta_vmbkt_objekt.a_wsf' || 'J' == params?.bewohnerPlus}"/>
            </td>
        </tr>
        </tbody>
    </table>

    <g:if test="${params?.oxgFiber != 'J'}">
    <!-- Workflow -->
    <table class="table-borderless table-danger table-sm border-bottom" style="width:${Config.widthContainer}">
        <thead>
        <tr>
            <th colspan="4" class="clickable" data-toggle="collapse" data-target="#group-of-rows-1"
                aria-expanded="false"
                aria-controls="group-of-rows-1">
                <h3>Workflow</h3>
            </th>
        </tr>
        </thead>
        <tbody id="group-of-rows-1" class="collapse show">
        <tr class="d-flex">

        <g:if test="${params?.'ta_vmbkt_objekt.a_wsf' != 'J'}">

            <!-- Checkbox 'O2' nicht angeklickt -->
            <th class="col-2" title="${ttKaa}"><label class="my-1 mr-2" for="ta_vmbkt_kaa_kad.wfKaa">KAA</label></th>
            <td>
                <g:select
                        name="ta_vmbkt_kaa_kad.wfKaa"
                        noSelection="${noselect}"
                        from="${wfKaa}"
                        optionKey="key"
                        optionValue="value"
                        value="${params?.'ta_vmbkt_kaa_kad.wfKaa'}"
                        style="width:${Config.width}"
                        onChange="colorDropdownSelection('ta_vmbkt_kaa_kad.wfKaa')"/>

            </td>



            <th class="col-2" title="${ttKad}"><label class="my-1 mr-2" for="ta_vmbkt_kaa_kad.wfKad">KAD</label></th>
            <td>
                <g:select
                        name="ta_vmbkt_kaa_kad.wfKad"
                        noSelection="${noselect}"
                        from="${wfKad}"
                        optionKey="key" optionValue="value"
                        value="${params?.'ta_vmbkt_kaa_kad.wfKad'}"
                        style="width:${Config.width}"
                        onChange="colorDropdownSelection('ta_vmbkt_kaa_kad.wfKad')"/>
            </td>
            </tr>

        </g:if>


        <tr class="d-flex">
            <th class="col-2" title="${ttKai}"><label class="my-1 mr-2" for="ta_vmbkt_kai.a_workflow">KAI</label></th>
            <td>
                <g:select
                        name="ta_vmbkt_kai.a_workflow"
                        noSelection="${noselect}"
                        from="${wfKai}"
                        optionKey="key" optionValue="value"
                        value="${params?.'ta_vmbkt_kai.a_workflow'}"
                        style="width:${Config.width}"
                        onChange="colorDropdownSelection('ta_vmbkt_kai.a_workflow')"/>
            </td>

        </tr>

        </tbody>
    </table>
    <!-- Ende oxgFiber -->
     </g:if>

    <g:if test="${params?.bewohnerPlus != 'J' && params?.oxgFiber != 'J'}">
        <!-- Panel nur eingeblendet wenn die Checkboxen bewohnerPlus oder oxgFiber nicht gesetzt sind -->
        <!-- Technische Parameter -->
        <table class="table-borderless table-danger table-sm border-bottom" style="width:${Config.widthContainer}">
            <thead>
            <tr>
                <th colspan="4" class="clickable" data-toggle="collapse" data-target="#group-of-rows-2"
                    aria-expanded="false"
                    aria-controls="group-of-rows-2">
                    <h3>${head3}</h3>
                </th>
            </tr>
            </thead>
            <tbody id="group-of-rows-2" class="collapse show">
            <tr class="d-flex">

                <!-- Selfinstall -->
                <th class="col-2" title="${ttSelfinstall}"><label class="form-check-label"
                                                                  for="ta_vmbkt_zpk.sel">Selfinstall</label></th>
                <td>

                    <g:radioGroup

                            labels="${labelJaNeinBeides}" values="['J', 'N', 'null']"
                            name="ta_vmbkt_zpk.sel"
                            style="margin-right: 10px"
                            value="${params?.'ta_vmbkt_zpk.sel' ?: 'null'}"><!-- wenn null dann 'null' -->
                        <g:message code="${it.label}"/>: ${it.radio}

                    </g:radioGroup>

                </td>

                <th class="col-1"></th>

                <g:if test="${params?.company != Config.company["Unitymedia"]}">
                    <!-- nur bei Footprint VKD einblenden -->
                        <!-- direkt versorgt -->
                    <th class="col-2" title="${ttDirektVersorgt}"><label class="form-check-label"
                                                                         for="ta_vmbkt_zpk.sel">${labelDirektVersorgt}</label>
                    </th>
                    <td>

                        <g:radioGroup

                                labels="${labelJaNeinBeides}" values="['J', 'N', 'null']"
                                name="ta_vmbkt_objekt.a_uep_im_objekt"
                                style="margin-right: 10px"
                                value="${params?.'ta_vmbkt_objekt.a_uep_im_objekt' ?: 'null'}"><!-- wenn null dann 'null' -->
                            <g:message code="${it.label}"/>: ${it.radio}

                        </g:radioGroup>

                    </td>
                </g:if>

            </tr>

            <tr class="d-flex">
                <!-- maxWE -->
                <th class="col-2" title="${ttMaxWe}"><label for="ta_vmbkt_objekt.a_max_we">${labelMaxWe}</label>
                </th>
                <td>
                    <g:field
                            type="number"
                            max="999"
                            name="ta_vmbkt_objekt.a_max_we"
                            value="${params?.'ta_vmbkt_objekt.a_max_we'}"
                            placeholder="${vonBis[0]}"
                            style="width:${Config.width}"/>
                </td>

                <th class="col-2 text-center"><label class="my-1 mr-2" for="ta_vmbkt_objekt.a_max_weBis"></label></th>
                <td>
                    <input type="number"
                           max="999" name="ta_vmbkt_objekt.a_max_weBis"
                           value="${params?.'ta_vmbkt_objekt.a_max_weBis'}"
                           placeholder="${vonBis[1]}"

                           style="width:${Config.width}"/>
                </td>

            </tr>

            <tr class="d-flex">
                <!-- DS -->
                <th class="col-2" title="${ttDs}">
                    <label for="ta_vmbkt_transfer_rate.dsVon">${labelDS}</label>
                </th>
                <td>
                    <input type="number"
                           max="999999"
                           min="0"
                           name="ta_vmbkt_transfer_rate.dsVon"
                           value="${params?.'ta_vmbkt_transfer_rate.dsVon'}"
                           placeholder="${vonBis[0]}"

                           style="width:${Config.width}"/>
                </td>
                <th class="col-2 text-center"><label for="ta_vmbkt_transfer_rate.dsBis"></label></th>
                <td><input type="number"
                           max="9999999"
                           min="0"
                           name="ta_vmbkt_transfer_rate.dsBis"
                           value="${params?.'ta_vmbkt_transfer_rate.dsBis'}"
                           placeholder="${vonBis[1]}"

                           style="width:${Config.width}"/>
                </td>
            </tr>
            <tr class="d-flex">
                <!-- US -->
                <th class="col-2" title="${ttUs}"><label for="ta_vmbkt_transfer_rate.usVon">${labelUS}</label></th>
                <td><g:field type="number"
                             max="9999999"
                             min="0"
                             name="ta_vmbkt_transfer_rate.usVon"
                             value="${params?.'ta_vmbkt_transfer_rate.usVon'}"
                             placeholder="${vonBis[0]}"

                             style="width:${Config.width}"/>
                </td>

                <th class="col-2 text-center"><label class="my-1 mr-2" for="ta_vmbkt_transfer_rate.usBis"></label></th>
                <td><g:field type="number"
                             max="9999999"
                             min="0"
                             name="ta_vmbkt_transfer_rate.usBis"
                             value="${params?.'ta_vmbkt_transfer_rate.usBis'}"
                             placeholder="${vonBis[1]}"

                             style="width:${Config.width}"/></td>
            </tr>

            <tr class="d-flex">
                <!-- DOCSIS -->
                <th class="col-2" title="${ttDocsis}">
                    <label for="ta_vmbkt_objekt.a_docsis">DOCSIS</label>
                </th>
                <td><g:select
                        name="ta_vmbkt_objekt.a_docsis"
                        noSelection="${noselect}"
                        from="${docsis}"
                        value="${params?.'ta_vmbkt_objekt.a_docsis'}"
                        optionKey="key"
                        optionValue="value"
                        style="width:${Config.width}"/></td>

            <g:if test="${params?.company == Config.company["Unitymedia"]}">
                    <!-- UM NE4 Status -->
                   <th class="col-2" title="NE4 Status"><label class="my-1 mr-2" for="ta_ref_um_ne4_status.a_ne4_status">NE4 Status</label>
                                   </th>
                                   <td><g:select
                                           name="ta_ref_um_ne4_status.a_ne4_status"
                                           noSelection="${noselect}"
                                           from="${umNe4Status}"
                                           optionKey="key"
                                           optionValue="value"
                                           value="${params?.'ta_ref_um_ne4_status.a_ne4_status'}"
                                           style="width:${Config.width}"/>
                                   </td>
               </g:if>
            </tr>

            <tr class="d-flex">
                <!-- ABK -->
                <th class="col-2" title="${ttAbk}"><label class="form-check-label" for="ta_vmbkt_objekt.a_abk_flag">ABK</label></th>
                    <td><g:radioGroup
                        labels="${labelJaNeinBeides}" values="['J', 'N', 'null']"
                        name="ta_vmbkt_objekt.a_abk_flag"
                        style="margin-right: 10px"
                        value="${params?.'ta_vmbkt_objekt.a_abk_flag' ?: 'null'}"><!-- wenn null dann 'null' -->
                        <g:message code="${it.label}"/>: ${it.radio}
                        </g:radioGroup></td>

                <th class="col-1"></th>

                  <!-- FTTB -->
                <th class="col-2" title="Fiber to the Building"><label class="form-check-label" for="ta_vmbkt_objekt.a_fiber_coax_flag">FTTB</label></th>
                    <td><g:radioGroup
                        labels="${labelCoaxFiberBeides}" values="['C', 'F', 'null']"
                        name="ta_vmbkt_objekt.a_fiber_coax_flag"
                        style="margin-right: 10px"
                        value="${params?.'ta_vmbkt_objekt.a_fiber_coax_flag' ?: 'null'}"><!-- wenn null dann 'null' -->
                        <g:message code="${it.label}"/>: ${it.radio}
                    </g:radioGroup></td>
            </tr>

            </tbody>
        </table>
     <!-- Ende bewohnerPlus, oxgFiber -->
      </g:if>

    <g:if test="${params?.bewohnerPlus != 'J'}">
        <!-- Technische Verfügbarkeit -->
        <table class="table-borderless table-danger table-sm border-bottom" style="width:${Config.widthContainer}">
            <thead>
            <tr>
                <th colspan="4" class="clickable" data-toggle="collapse" data-target="#group-of-rows-3"
                    aria-expanded="false"
                    aria-controls="group-of-rows-3">
                    <h3>${head4}</h3>
                </th>
            </tr>
            </thead>

            <tbody id="group-of-rows-3" class="collapse show">

            <g:if test="${params?.'ta_vmbkt_objekt.a_wsf' != 'J' && params?.oxgFiber != 'J'}">
            <!-- wenn O2 Checkbox nicht aktiviert ist -->
                <tr class="d-flex">
                    <th class="col-2" title="${ttKaa}"><label class="my-1 mr-2" for="ta_vmbkt_kaa_kad.tvKaa">KAA</label>

                    </th>
                    <td><g:select
                            name="ta_vmbkt_kaa_kad.tvKaa"
                            noSelection="${noselect}"
                            from="${tvKaa}"
                            optionKey="key"
                            optionValue="value"
                            value="${params?.'ta_vmbkt_kaa_kad.tvKaa'}"
                            style="width:${Config.width}"/>
                    </td>

                    <th class="col-2" title="${ttKad}"><label class="my-1 mr-2" for="ta_vmbkt_kaa_kad.tvKad">KAD</label>
                    </th>
                    <td><g:select
                            name="ta_vmbkt_kaa_kad.tvKad"
                            noSelection="${noselect}"
                            from="${tvKad}"
                            optionKey="key"
                            optionValue="value"
                            value="${params?.'ta_vmbkt_kaa_kad.tvKad'}"
                            style="width:${Config.width}"/>
                    </td>

                </tr>
            <!-- Ende O2 Chekcbox -->
            </g:if>

            <g:if test="${params?.oxgFiber != 'J'}">
            <tr class="d-flex">
                <th class="col-2" title="${ttKai}"><label class="my-1 mr-2" for="ta_vmbkt_kai.a_tv">KAI</label></th>
                <td><g:select
                        name="ta_vmbkt_kai.a_tv"
                        noSelection="${noselect}"
                        from="${tvKai}"
                        optionKey="key"
                        optionValue="value"
                        value="${params?.'ta_vmbkt_kai.a_tv'}"
                        style="width:${Config.width}"/>
                </td>

                <th class="col-2" title="${ttUepZustand}"><label class="my-1 mr-2"
                                                                 for="ta_vmbkt_objekt.a_uep_zustand">${labelUep}</label>
                </th>
                <td><g:select
                        name="ta_vmbkt_objekt.a_uep_zustand"
                        noSelection="${noselect}"
                        from="${uepZustand}"
                        optionKey="key"
                        optionValue="value"
                        value="${params?.'ta_vmbkt_objekt.a_uep_zustand'}"
                        style="width:${Config.width}"/>
                </td>
            </tr>
            <!-- Ende oxgFiber Checkbox -->
            </g:if>

            <g:if test="${params?.oxgFiber == 'J'}">
            <tr class="d-flex">
                            <th class="col-2" title="Fiber Status"><label class="my-1 mr-2" for="oxgFiberStatus">Fiber Status</label></th>
                            <td><g:select
                                    name="ta_vmbkt_fiber"
                                    noSelection="${noselect}"
                                    from="${tvFiberStatus}"
                                    optionKey="key"
                                    optionValue="value"
                                    value="${params?.'ta_vmbkt_fiber'}"
                                    style="width:${Config.width}"/>
                            </td>

             </tr>
            <!-- Ende oxgFiber Checkbox -->
             </g:if>
            </tbody>
        </table>
    <!-- Ende BewohnerPlus Checkbox -->
    </g:if>

<!-- Vertragssituation -->
    <g:if test="${params?.oxgFiber != 'J'}">
    <g:if test="${params?.company != Config.company["Unitymedia"]}">

        <table class="table-borderless table-danger table-sm border-bottom" style="width:${Config.widthContainer}">
            <thead>
            <tr>
                <th colspan="4" class="clickable" data-toggle="collapse" data-target="#group-of-rows-4"
                    aria-expanded="false"
                    aria-controls="group-of-rows-4">
                    <h3>${head5}</h3>
                </th>
            </tr>
            </thead>

            <tbody id="group-of-rows-4" class="collapse show">
            <tr class="d-flex">
                <th class="col-2"><label class="my-1 mr-2"
                                         for="ta_vmbkt_wizard.a_ver_1_nummer">${label3}</label></th>
                <td>
                    <g:field type="number"
                             name="ta_vmbkt_wizard.a_ver_1_nummer"
                             placeholder="*"
                             min="0"
                             max="999999999"
                             value="${params?.'ta_vmbkt_wizard.a_ver_1_nummer'}"

                             style="width:${Config.width}"/>
                </td>

                <th class="col-2"><label class="my-1 mr-2"
                                         for="ta_vmbkt_wizard.a_kun_1_nummer">${label2}</label></th>
                <td>
                    <g:field type="number"
                             name="ta_vmbkt_wizard.a_kun_1_nummer"
                             placeholder="*"
                             min="0"
                             max="999999999"
                             value="${params?.'ta_vmbkt_wizard.a_kun_1_nummer'}"

                             style="width:${Config.width}"/>
                </td>

            <tr class="d-flex">
                <th class="col-2"><label class="my-1 mr-2"
                                         for="ta_vmbkt_objekt.a_ccb1">${label4}</label></th>
                <td><g:select
                        name="ta_vmbkt_objekt.a_ccb1"
                        noSelection="${noselect}"
                        from="${ccb1}"
                        optionKey="key" optionValue="value"
                        value="${params?.'ta_vmbkt_objekt.a_ccb1'}"
                        style="width:${Config.width}"/>
                </td>

                <th class="col-2"><label class="my-1 mr-2" for="ta_vmbkt_objekt.a_ccb2">${label1}</label></th>
                <td><g:select
                        name="ta_vmbkt_objekt.a_ccb2"
                        noSelection="${noselect}"
                        from="${ccb2}"
                        optionKey="key" optionValue="value"
                        value="${params?.'ta_vmbkt_objekt.a_ccb2'}"
                        style="width:${Config.width}"/>
                </td>


            <tr class="d-flex">
                <th class="col-2"><label class="my-1 mr-2"
                                         for="ta_vmbkt_wizard.a_vertriebssegment">Salessegment</label></th>
                <td><g:select
                        name="ta_vmbkt_wizard.a_vertriebssegment"
                        noSelection="${noselect}"
                        from="${salesSegment}"
                        optionKey="key" optionValue="value"
                        value="${params?.'ta_vmbkt_wizard.a_vertriebssegment'}"
                        style="width:${Config.width}"/>
                </td>

                <th class="col-2"><label class="my-1 mr-2"
                                         for="ta_vmbkt_wizard.a_vertriebssegment">${labelVertragscode}</label></th>
                <td><g:select
                        name="wiz_customer_contracts.contract_code"
                        noSelection="${noselect}"
                        from="${contractCode.sort()}"
                        optionKey="key" optionValue="value"
                        value="${params?.list('wiz_customer_contracts.contract_code')}"
                        multiple="true"
                        style="width:${Config.width}"/>
                </td>
            </tr>
            </tbody>
        </table>
    </g:if>

<!-- Vertragssituation (GS2 Element) UM-Footprint-->
    <g:if test="${params?.company == Config.company["Unitymedia"]}">

        <table class="table-borderless table-danger table-sm border-bottom" style="width:${Config.widthContainer}">
            <thead>
            <tr>
                <th colspan="4" class="clickable" data-toggle="collapse" data-target="#group-of-rows-6"
                    aria-expanded="false"
                    aria-controls="group-of-rows-6">
                    <h3>${head5}</h3>
                </th>
            </tr>
            </thead>

            <tbody id="group-of-rows-6" class="collapse show">


            <tr class="d-flex">
                <th class="col-2" title="${ttGs2}"><label class="my-1 mr-2"
                                         for="ta_vmbkt_um_dwh.a_gebaeude_segment_2">${labelGs2Element}</label></th>
                <td><g:select
                        name="ta_vmbkt_um_dwh.a_gebaeude_segment_2"
                        noSelection="${noselect}"
                        from="${gs2Element}"
                        optionKey="key" optionValue="value"
                        value="${params?.'ta_vmbkt_um_dwh.a_gebaeude_segment_2'}"
                        style="width:${Config.width}"/>
                </td>


            </tr>
            </tbody>
        </table>
    </g:if>
    <!-- Ende oxgFiber -->
    </g:if>

<!-- BewohnerPlus -->
    <g:if test="${params?.bewohnerPlus == 'J'}">
        <table class="table-borderless table-danger table-sm border-bottom" style="width:${Config.widthContainer}">
            <thead>
            <tr>
                <th colspan="4" class="clickable" data-toggle="collapse" data-target="#group-of-rows-5"
                    aria-expanded="false"
                    aria-controls="group-of-rows-5">
                    <h3>${labelBewohnerPlus}</h3>
                </th>
            </tr>
            </thead>
            <tbody id="group-of-rows-5" class="collapse show">
            <tr class="d-flex">

                <th>
                    <!-- kein Label falls Unity -->
                    <label for="ta_vmbkt_kaa_kad.bpKaa">${(params?.company != Config.company["Unitymedia"]) ? 'KAA' : ''}</label>
                </th>
                <td class="col-2">
                    <g:radioGroup

                            labels="${labelJaNein}" values="['J', 'N']"
                            name="ta_vmbkt_kaa_kad.bpKaa"
                            style="margin-right: 10px"
                            value="${params?.'ta_vmbkt_kaa_kad.bpKaa' ?: 'N'}">
                        <g:message code="${it.label}"/>: ${it.radio}

                    </g:radioGroup>

                </td>


                <g:if test="${params?.company != Config.company["Unitymedia"]}">
                    <th><label for="ta_vmbkt_kaa_kad.bpKad">KAD</label></th>
                    <td class="col-2">
                        <g:radioGroup

                                labels="${labelJaNein}" values="['J', 'N']"
                                name="ta_vmbkt_kaa_kad.bpKad"
                                style="margin-right: 10px"
                                value="${params?.'ta_vmbkt_kaa_kad.bpKad' ?: 'N'}">
                            <g:message code="${it.label}"/>: ${it.radio}

                        </g:radioGroup>
                    </td>

                    <th><label or="ta_vmbkt_kai.bpKai">KAI</label></th>
                    <td class="col-2">
                        <g:radioGroup

                                labels="${labelJaNein}" values="['J', 'N']"
                                name="ta_vmbkt_kai.bpKai"
                                style="margin-right: 10px"
                                value="${params?.'ta_vmbkt_kai.bpKai' ?: 'N'}">
                            <g:message code="${it.label}"/>: ${it.radio}

                        </g:radioGroup>
                    </td>
                </g:if>
            </tr>

            </tbody>
        </table>

    </g:if>


    <g:if test="${result}">
        <g:hiddenField name="strQuery" value="${sqlQuery}"/>
        <table class="table table-hover" style="width:${Config.widthContainer}">
            <thead>
            <tr>
                <th>${tHeadId}</th>
                <g:if test="${params?.company == Config.company["Unitymedia"]}"><th>${tHeadUmId}</th></g:if> <!-- nur bei Unity (ADS-Abfrage) -->
                <th>${tHeadAdr}</th>
                <th>${tHeadOnkz}</th>
            </tr>
            </thead>
            <tbody>
            <g:each in="${result}">
                <g:if test="${it.OBJEKT_ID == 'ERROR'}">
                    <!-- Es ist ein DB-Problem aufgetreten -->
                    <tr class="table-warning">
                        <td>${it.OBJEKT_ID}</td>
                        <td>${it.ADRESSE}</td>
                    </tr>
                </g:if>
                <g:else>
                    <!-- DB-Abfrage erfolgreich -->
                    <tr class="table-success">
                        <td>${it.OBJEKT_ID}</td>
                        <g:if test="${params?.company == Config.company["Unitymedia"]}"><td>${it.UM_ADRESSE_ID}</td></g:if>    <!-- nur bei Unity (ADS-Abfrage) -->
                        <td>${it.ADRESSE}</td>
                        <td>${it.ONKZ}</td>
                    </tr>
                </g:else>

            </g:each>
            </tbody>
        </table>

    </g:if>

</div>