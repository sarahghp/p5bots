var express = require('express'),
    app     = express(),
    server  = require('http').Server(app),
    io      = require('socket.io')(server),
    firmata = require('firmata');

// Setup server, sockets, and events

server.listen(8000);

app.use(express.static('src'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.emit('hello', 'tiger');
  socket.on('browser', function(data){
    console.log(data);
  });

  socket.on('board object', function(data){
    var board = new firmata.Board(data.port ,function(err){
      if (err) {
        console.log(err);
        return;
      }

      var ledPin = data.pin;

      console.log("connected");

      var ledOn = true;
      board.pinMode(ledPin, board.MODES.OUTPUT);

      setInterval(function() {
        if (ledOn) {
          console.log("+");
          board.digitalWrite(ledPin, board.HIGH);
        } else {
          console.log("-");
          board.digitalWrite(ledPin, board.LOW);
        }

        ledOn = !ledOn;

      }, 500);
  });

});




}); 