var express = require('express'),
    app     = express(),
    server  = require('http').Server(app),
    io      = require('socket.io')(server),
    firmata = require('firmata');

// Setup server, sockets, and events

server.listen(8000);

app.use(express.static('p5sensors'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


// App code
 
io.on('connect', function(socket){
  
  // Debugging
  socket.emit('hello', 'tiger');
  socket.on('browser', function(data){
    console.log(data);
  });
  
  // Board setup
  var board;

  socket.on('board object', function(data){
    boardData = data;
    board = new firmata.Board(data.port, function(err){
      if (err) {
        throw new Error(err);
      }
      socket.emit('board ready');
    });
  });

  // Action functions
  socket.on('blink', function(data){
    var ledPin = data.pin,
        ledOn = true;

    console.log('connected');

    board.pinMode(ledPin, board.MODES[data.mode]);

    setInterval(function() {
      if (ledOn) {
        console.log('+');
        board.digitalWrite(ledPin, board.HIGH);
      } else {
        console.log('-');
        board.digitalWrite(ledPin, board.LOW);
      }

      ledOn = !ledOn;

    }, 500);
  });

}); 