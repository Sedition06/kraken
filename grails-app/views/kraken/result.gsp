<%--
  Created by IntelliJ IDEA.
  User: Rothenberger.Ricardo
  Date: 23.10.2019
  Time: 16:43
--%>

<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <title>Adressauskunft</title>
</head>

<body>

<div id="create-inputForm" class="content scaffold-create" role="main">
    <h1><g:message message="Input Form"></g:message></h1>
    <g:form action="index">
        <fieldset class="form">
            <g:render template="inputForm"/>
        </fieldset>
        <fieldset class="buttons">
            <g:submitButton name="search" value="Suchen"/>
        </fieldset>


        <g:each in="${result}">
            <div class="w3-panel w3-blue w3-round-xlarge">
                <p>${it.A_PLZ} ${it.A_ORTSNAME}, ${it.A_STRNAME} ${it.A_HAUSNR} ${it.A_HAUSNR_ZUS}</p>
            </div>
        </g:each>

    </g:form>
</div>

</body>
</html>