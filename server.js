var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var bodyParser = require("body-parser");
var fs = require('fs');


//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/bower_components'))


app.get('/',function(req,res){
  res.sendFile(__dirname + "/index.html");
});


app.post('/login', function(req, res){
  var username=req.body.username;
  var password=req.body.password;
  console.log(username + " " + password);
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(__dirname + "/conductor.json");
});

app.get('/vehiculos', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(__dirname + "/vehiculos.json");
});

app.get('/calificaciones', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(__dirname + "/calificaciones.json");
});

app.get('/notificaciones', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(__dirname + "/notificaciones.json");
});

app.get('/servicios_realizados', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(__dirname + "/servicios_realizados.json");
});



var objTest = JSON.parse(fs.readFileSync(__dirname + "/testViaje.json", 'utf8'));


io.on('connect', function(client) {

  var sessionid2 = client.id;
  console.log('Client connect...' + sessionid2)//+ client.io.engine.id);

  client.on('disconnect', function(){
    console.log('user disconnected');
  })


  client.on('requestService', function(data) {
    client.broadcast.emit('requestRide', objTest);
    console.log(data);
  });

  client.on('updatePosition', function(data) {
    client.broadcast.emit('updateLocation', data);
    console.log(data);
  });

  client.on('ratePassenger', function(data) {
    console.log(data);
  });


  client.on('rideTest', function(data) {
        console.log(data);
        client.emit('requestRide', objTest);
    });


    client.on('mensajes en cola', function(data) {
      console.log(data);
    });

    client.on('rideStart', function(data) {
      console.log(data);
    });

    client.on('rideCancel', function(data) {
      console.log(data);
    });

    client.on('rideCanceled', function(data) {
      client.broadcast.emit('rideCanceled', data);
      console.log(data);
    });

    client.on('rideVerify', function(data) {
      client.broadcast.emit('rideVerify', data);
      console.log(data);
    });

    client.on('rideCode', function(data) {
      io.emit('rideCheck', '{"estado_codigo":"codigo_correcto"}');
      console.log(data);
    });

    client.on('rideCheck', function(data) {
      console.log(data);
    });


});


server.listen(4000)
