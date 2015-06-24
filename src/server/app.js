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

  socket.emit('Just emitting');

  socket.on('board object', function(data){
    boardData = data;
    board = new firmata.Board(data.port, function(err){
      if (err) {
        throw new Error(err);
      }
      console.log('board object caught', data);
      socket.emit('board ready');
    });
  });

  // Pin setup
  socket.on('pin object', function(data){
    console.log('pin object caught', data);
    board.pinMode(data.pin, board.MODES[data.direction]);
  });

  // Action functions
  
  socket.on('action', function(data){
    if (data.arg){
      if (data.arg && (data.arg === 'HIGH' || data.arg === 'LOW')) {
        board[data.action](board[data.pin], board[data.arg])
      } else {
        board[data.action](board[data.pin], board[data.arg])
      }
    } else if (data.action === 'digitalRead' || data.action === 'analogRead') {
      board[data.action](board[data.pin], function(val){
        socket.emit('return val', { val: val })
      });
    }
    
  });

  socket.on('blink', function(data){
    var ledPin = data.pin,
        ledOn = true;

    console.log('connected');

    board.pinMode(ledPin, board.MODES[data.direction]);

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