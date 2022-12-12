
// globale variabelen
var aantalKnikkers = 0;    // aantal knikkers dat bovenin is binnengekomen
var poortIsOpen = false;
const UPDATE_INTERVAL = 5000;   // tijd in milliseconden tussen het door widget opvragen van gegevens
var button;
var teller;


/**
 * setup
 * de code in deze functie wordt eenmaal uitgevoerd,
 * als p5js wordt gestart
 */
function setup() {
  // Maak het canvas van je widget
  createCanvas(300, 600);

  // maak een nieuw tellerobject
  // op de positie (150, 50)
  teller = new Teller(150, 50);

  // maak een button en stel deze in
  button = createButton('Open poort');
  button.position(200, 300);
  button.mouseClicked(stuurNieuweInstellingen);

  // om de UPDATE_INTERVAL milliseconden wordt 'vraagSensorData' uitgevoerd
  setInterval(vraagSensorData, UPDATE_INTERVAL);
}


/**
 * draw
 * de code in deze functie wordt meerdere keren per seconde
 * uitgevoerd door de p5 library, nadat de setup functie klaar is
 */
function draw() {
  // schrijf hieronder de code van je widget
  // hieronder wordt schematisch een knikkerbaan getekend

  // achtergrond: houtkleur, kies vooral iets anders
  background(175, 144, 105);

  // twee dikke strepen als 'opvangbak'
  stroke(0, 0, 0);
  strokeWeight(10);
  line(50, 20, 135, 60);
  line(250, 20, 165, 60);

  // toon de teller
  teller.show();
}

function buttonGeklikt() {
  // verander waar de van poortIsOpen
  if (poortIsOpen == true) {
    poortIsOpen = false;
  }
  else {
    poortIsOpen = true;
  }

  // stuur de nieuwe waarde door
  stuurNieuweInstellingen();

}


// stuurt een verzoek aan de server dat alle
// sensordata opvraagt
function vraagSensorData() {
  var request = new XMLHttpRequest();

  // maak een http-verzoek
  request.open('GET', '/api/get/data', true)

  // wat uitvoeren als het antwoord teruggegeven wordt?
  request.onload = function () {
    var data = JSON.parse(request.response);

    if (request.status == 200) {
      console.log("Dit geeft de server terug:" + data);
      teller.aantal = data.aantalKnikkers;
      poortIsOpen = data.poortIsOpen;
    }
    else {
      console.log("server reageert niet zoals gehoopt:");
      console.log(request.response);
    }
  }

  // verstuur het request
  request.send()
}


// stuurt een http-verzoek aan de server met de
// nieuwe instellingen
function stuurNieuweInstellingen() {
  var request = new XMLHttpRequest();

  // maak een http-verzoek
  request.open('GET', '/api/set/data?poortIsOpen=' + poortIsOpen, true)

  // wat uitvoeren als het antwoord teruggegeven wordt?
  request.onload = function () {
    if (request.status == 201) {
      // geeft positieve feedback in widget ofzo
      console.log("Server accepteerde instellingen.")
    }
    else {
      console.log("server reageert niet zoals gehoopt:");
      console.log(request.response);
    }
  }

  // verstuur het request
  request.send()
}