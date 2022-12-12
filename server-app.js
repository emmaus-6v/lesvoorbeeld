const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const port = 8080;

// het object waarin we de data van
// de knikkerbaan in bewaren
var dataObject = {};

// een paar instellingen voor de server
app.use(express.static(path.join(__dirname, '/widget')));

// definieer startpunten voor de server
app.get('/', geefWidget);
app.get('/api/echo', echoRequest);
app.get('/api/get/data', getData);
app.get('/api/set/data', setData);

// start de server
app.listen(port, serverIsGestart);


// --------------------------------------------------

// wordt uitgevoerd als de server is opgestart
function serverIsGestart() {
  var url = process.env.GITPOD_WORKSPACE_URL;
  console.log(`De server is opgestart en is bereikbaar op ${url}:${port}`);
}


// stuur het html-bestand van de widget
function geefWidget(request, response) {
  response.redirect('index.html');
}


// deze optie is alleen voor het uittesten
// van de verbinding:
// stuur de variabelen uit het request
// terug naar de browser en in de console
function echoRequest(request, response) {
  console.log(request.query);
  response.status(200).send(request.query);
}


// geeft de gegevens van dataObject terug in JSON
function getData(request, response) {
  response.status(200).send(dataObject);
}


// updatet dataObject met nieuwe gegevens
function setData(request, response) {
  // lees de verzonden data en print deze in de console
  var attributes = Object.getOwnPropertyNames(request.query);
  console.log("De gekregen data is: " + attributes);

  // updatet data-object met gekregen data
  for (var i = 0; i < attributes.length; i++) {
    dataObject[attributes[i]] = request.query[attributes[i]]
  }

  // stuur een oké terug: status 201 en
  // voor de developer de boodschap "data received"
  response.status(201).send("data received")
}