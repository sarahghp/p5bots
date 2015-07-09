#!/usr/bin/env node
'use strict'

var express = require('express'),
    app     = express(),
    server  = require('http').Server(app),
    io      = require('socket.io')(server),
    firmata = require('firmata'),
    program = require('commander');

// Parse command-line args
var directory, index, program;

program
  .description('Let your board talk to your sketch')
  .option('-d, --dir <d>', 'Set base directory for server')
  .option('-f, --file <f>', 'Set file to use')
  .parse(process.argv);

exports.program = program;
exports.directory = directory = program.dir || __dirname;
exports.index = index = program.file || (__dirname + '/index.html');

// Setup server, sockets, and events

server.listen(8000);

app.use(express.static(directory));
console.log('server starting');

app.get('/', function(req, res) {
  res.sendFile(index);
});


// App code
 
var board;

io.of('/sensors').on('connect', function(socket) {
  console.log('connected');

  // Error handling
  socket.on('error', function(err){
    console.log(err);
  });
  
  // Board setup
  
  socket.on('board object', function(data) {
    console.log('board object caught', data);
    if (!board) {
      board = new firmata.Board(data.port, function(err) {
        if (err) {
          throw new Error(err);
        }
        console.log('board object caught', data);
        socket.emit('board ready');
      });
    } else {
      console.log('board object caught', data);
      socket.emit('board ready');
    }
  });

  // Pin setup
  socket.on('pin object', function(data){
    console.log('pin object caught', data);
    // Digital pins are set to INPUT or OUTPUT in firmata
    data.mode === 'digital' ?
       board.pinMode(data.pin, board.MODES[data.direction.toUpperCase()]) :
       board.pinMode(data.pin, board.MODES[data.mode.toUpperCase()]);
  });

  // Action functions
  
  // The primary action function formats the read & write functions & sends
  // these to firmata
  socket.on('action', function(data){
    // console.log('action data', data);
    var argument = data.arg;
    if (argument){
      // If it is digtalWrite, augment the argument with `board` to match firmata call
      if (argument && (argument === 'HIGH' || argument === 'LOW')) {
        board[data.action](data.pin, board[argument]);
      // or if it is either type of read, construct the callback & send
      } else if (data.type === 'read') { 
        var constructArg = function(args) { 
          return Function.apply(this, args); 
        };
        var constructed = constructArg(argument);
        board[data.action](data.pin, constructed);
      } else {
        board[data.action](data.pin, argument);
      }
    // Otherwise it is read with no argument, set pin.val on update
    } else if (data.type === 'read') {
      board[data.action](data.pin, function(val){
        socket.emit('return val', { val: val });
      });
    }
  });


  // Special functions
   
  
  // LED.Blink

  socket.on('blink', function(data){
    var ledPin = data.pin,
        ledOn = true;

    var blinkID = setInterval(function() {
      if (ledOn) {
        board.digitalWrite(ledPin, board.HIGH);
      } else {
        board.digitalWrite(ledPin, board.LOW);
      }

      ledOn = !ledOn;

    }, 500);

    socket.on('blink cancel', function(data) {
      clearInterval(blinkID);
    });

  });

  // LED.Fade
  
  socket.on('fade', function(data){
    console.log('fade called', data, board.pins);
    board.pinMode(data.pin, board.MODES.PWM);

    var time     = data.time,
        start    = data.start,
        stop     = data.stop,
        inc      = data.inc,
        steps    = time / inc,
        span     = Math.abs(start - stop),
        vps      = span / steps,
        mult     = stop > start ? 1 : -1,
        val      = start;


    function nextVal(a, b) {
      return a + mult * b;
    }
  
    for (var i = 0; i <= steps; i++){
      (function(num){
        setTimeout(function(){
          board.analogWrite(data.pin, val);
          val = nextVal(val, vps);
        }, num * inc);
      })(i);
    }
    

    

  });




});

