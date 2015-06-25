'use strict'

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
  var board, constructed;

  socket.emit('Just emitting');

  socket.on('board object', function(data){
    var boardData = data;
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
    data.mode === 'digital' ?
       board.pinMode(data.pin, board.MODES[data.direction]) :
       board.pinMode(data.pin, board.MODES[data.mode]);
  });

  // Action functions
  
  socket.on('action', function(data){
    // console.log('action data', data);
    var argument = data.arg;
    if (argument){
      if (argument && (argument === 'HIGH' || argument === 'LOW')) {
        board[data.action](data.pin, board[argument])
      } else if (data.type === 'read') { 
        var constructArg = function(args) { 
          return Function.apply(this, args); 
        };
        var constructed = constructArg(argument);
        board[data.action](data.pin, constructed);
      } else {
        board[data.action](data.pin, argument)
      }
    } else if (data.type === 'read') {
      board[data.action](data.pin, function(val){
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