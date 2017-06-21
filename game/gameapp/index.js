// Setup basic express server
var express = require('express');   //express aanroepen
var app = express();                //functie express een variabele maken
var server = require('http').createServer(app); // server maken met express
var io = require('../..')(server); //Socket met de server verbinden
var port = process.env.PORT || 3000; //luisteren op poort 3000

var whiteboard = require('./whiteboard.js').connect(io); //invoegen whiteboard.js
var chatroom = require('./chatroom.js').connect(io); // invoegen chatroom.js


//console berichtje dat de server luistert op poort 3000
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

//Express deze directory laten hosten
// Routing
app.use(express.static(__dirname + '/public'));




