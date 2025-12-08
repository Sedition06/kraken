<%--
  Created by IntelliJ IDEA.
  User: Rothenberger.Ricardo
  Date: 22.10.2019
  Time: 10:16
--%>

<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <title>KRAKEN</title>

    <link rel="stylesheet" href="${resource(dir: 'assets', file: 'bootstrap.min.css')}" type="text/css">
    <link rel="stylesheet" href="${resource(dir: 'assets', file: 'kraken.css')}" type="text/css">

    <!-- für die Aufklappsymbole -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <asset:link rel="icon" href="favicon.ico" type="image/x-ico"/>

</head>

<body onload="initLoad()">


<g:form action="index">
    <g:render template="inputForm"/>
</g:form>

<asset:javascript src="jquery-3.4.1.min.js"/>
<asset:javascript src="bootstrap.min.js"/>
<asset:javascript src="helper.js"/>

<g:javascript>
    $(document).ready(function () {
        $('#search').click(function () {

            if ($('#environment').val() != '' && $('#company').val() != '') {
                // nur wenn Pflichtfelder ausgewählt sind, Spinner einblenden
                $('#spinner').show();
            }


        });
    });
</g:javascript>

</body>
</html>