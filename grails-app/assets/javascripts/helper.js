function initInput() {

    var statusLangSwitch = document.getElementById('langSwitch').checked;  // Status des Switch abfragen

    document.querySelectorAll('select').forEach(function(node) {

        node.value=''
        node.style.backgroundColor = "white"; // Hintergrundfarbe des Defaultwertes einer Auswahlbox muss ggf. zurückgesetzt werden


    });

    document.querySelectorAll('input').forEach(function(node) {


        for (var i = 0; i < node.attributes.length; i++) {
            var attrib = node.attributes[i];
           //  console.log(attrib.name + " = " + attrib.value );
            if(attrib.value == 'checkbox'){
                node.checked = false
            }else if(attrib.value == 'number' || attrib.value == 'radio'){
                console.log(attrib.name + " = " + attrib.value );
                console.log(attrib.text)
                node.value='null'

            }
        }

    });

    if(statusLangSwitch == true){
        // Sprachschalter setzen
        document.getElementById('langSwitch').checked = true;
    }
}


function switchLanguage(elementId, aktion) {
    var x = document.getElementById(elementId).checked;  // Status des Switch abfragen
    console.log("switchLanguage isChecked?: " + x)
    var lang = ""
    if(x == true){
        lang = 'en'
    }else{
        lang = 'de'
    }

    console.log("switchLanguage lang?: " + lang)
    var z = document.cookie;
    console.log("COOKIE 1: " + z)

    //document.cookie = "language=" + lang;  // Cookie für Sprache setzen
    //checkCookie("language", lang)
    setCookie("language", lang, 1);



    var y = document.cookie.toString();
    console.log("COOKIE 2: " + y)


    document.location.href="";   // Aktion neu laden

}

function setChecked(elementId) {

    var x  = document.cookie;
    console.log("setChecked 1: " + x)

    if (x == 'language=en'){
        console.log("setChecked 2: " + x)
        // setzt Checkbox bzw Switch wenn Sprachcookie englisch
        document.getElementById(elementId).checked = true;
    }

}

// Hintergrundfarben der DropDown -Einträge
function colorDropdwon() {

    var container = document.querySelector("#group-of-rows-1");  // nur im Workflow-Panel die Dropdown einfärben

    container.querySelectorAll('option').forEach(function (node) {

        //  Farben setzen
        switch (node.value) {
            case 'A':
                node.style.backgroundColor = "red";
                break
            case 'B':
                node.style.backgroundColor = "green";
                break
            case 'I':
                node.style.backgroundColor = "yellow";
                break
            case 'V':
                node.style.backgroundColor = "DeepSkyBlue";
                break
            case 'C':
                node.style.backgroundColor = "orange";
                break
            case 'Y':
                node.style.backgroundColor = "yellow";
                break
            case 'S':
                node.style.backgroundColor = "lightgreen";
                break
            case '':
                node.style.backgroundColor = "white";
                break

        }
    });


}

// Hintergrundfarben des ausgewählten DropDown Wertes
function colorDropdownSelection(elementId) {
   var x =  document.getElementById(elementId)

    //  Farbe für ausgewählten Wert setzen
    switch (x.value) {
        case 'A':
            x.style.backgroundColor = "red";
            break
        case 'B':
            x.style.backgroundColor = "green";
            break
        case 'I':
            x.style.backgroundColor = "yellow";
            break
        case 'V':
            x.style.backgroundColor = "DeepSkyBlue";
            break
        case 'C':
            x.style.backgroundColor = "orange";
            break
        case 'Y':
            x.style.backgroundColor = "yellow";
            break
        case 'S':
            x.style.backgroundColor = "lightgreen";
            break
        case '':
            x.style.backgroundColor = "white";
            break

    }

}

function colorSelectedWf() {

    var ids = []
    // IDs von Dropdowns im Workflow-Panel in Liste ids speichern
    var container = document.querySelector("#group-of-rows-1");
    container.querySelectorAll('select').forEach(function (node){
        ids.push(node.getAttribute('id'))
    })

    var x
    for(x in ids){
        // ausgewählte Werte entsprechend einfärben
        colorDropdownSelection(ids[x])
    }
}


/**
 * Checkbox "Region - alle", soll alle Region Checkboxen aktivieren bzw. deaktivieren
 */
function setRegions() {

    var x = document.getElementById('ta_vmbkt_objekt.a_regionalle').checked
    var o2 = document.getElementById('ta_vmbkt_objekt.a_wsf').checked
    var langSwitch = document.getElementById('langSwitch').checked
    var bewohnerPlus = document.getElementById('bewohnerPlus').checked
    var oxgFiber = document.getElementById('oxgFiber').checked

    document.querySelectorAll("input").forEach(function(node) {

        for (var i = 0; i < node.attributes.length; i++) {
            var attrib = node.attributes[i];
            //console.log("RIRO setRegions " + attrib.name + " = " + attrib.value);
            if(x && attrib.value == 'checkbox'){
                node.checked = true
            }else if(!x && attrib.value == 'checkbox'){
                node.checked = false
            }
        }

    });

    // Checkboxen die keine Regionen sind, auf ursprünglichen Wert setzen
    document.getElementById('ta_vmbkt_objekt.a_wsf').checked = o2
    document.getElementById('langSwitch').checked = langSwitch
    document.getElementById('bewohnerPlus').checked = bewohnerPlus
    document.getElementById('oxgFiber').checked = oxgFiber
}



function initLoad() {
    console.log("HOST: " + window.location.hostname)
    // Sprach-Switch einstellen
    setChecked('langSwitch')

    // bestimmte Dropdown-Werte einfärben
    colorDropdwon()

    // sorgt dafür dass nach einer Suche die im Workflow-Panel ggf. ausgewählten Werte ihre entsprechende Farbe bekommen, d.h. nicht weiß werden
    colorSelectedWf()

}



function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie(cname, cvalue) {
    var c = getCookie(cname);
    if (c != "") {
        //alert("Welcome again " + c);
        console.log("checkCookie 1: " + c)
    } else {
       // c = prompt("Please enter your name:", "");
        //if (c != "" && c != null) {
            setCookie(cname, cvalue, 365);
        //}
    }
}

function clearRegions() {
    // deselektiert die Checkbox "alle Regionen"
    document.getElementById('ta_vmbkt_objekt.a_regionalle').checked = false
}



function showEasteregg() {
    document.addEventListener('DOMContentLoaded', function() {
        var logo = document.getElementById('logo');
        var image = document.getElementById('ebc');

        if (logo && image) {
            logo.addEventListener('dblclick', function(event) {
                event.preventDefault(); // Verhindert das Standardverhalten des Links
                if (image.style.display === 'none') {
                    image.style.display = 'block';
                } else {
                    image.style.display = 'none';
                }
            });
        } else {
            console.error('Elemente mit den IDs "logo" oder "ebc" wurden nicht gefunden.');
        }
    });
}

showEasteregg();







