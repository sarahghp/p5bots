#!/usr/bin/env node
'use strict'

var express    = require('express'),
    app        = express(),
    server     = require('http').Server(app),
    io         = require('socket.io')(server),
    firmata    = require('firmata'),
    program    = require('commander'),
    gamma      = require('./gamma.js');

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

// var serial = require('./serial.js'); 
var board;

io.of('/sensors').on('connect', function(socket) {
  console.log('connected');
  exports.socket = socket;

  // Error handling
  
  socket.on('error', function(err){
    console.log(err);
  });
  
  // Board setup
  
  socket.on('board object', function(data) {
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
        ledOn = true,
        length = data.length || 500;

    board.pinMode(ledPin, board.MODES.OUTPUT);

    var blinkID = setInterval(function() {
      if (ledOn) {
        board.digitalWrite(ledPin, board.HIGH);
      } else {
        board.digitalWrite(ledPin, board.LOW);
      }

      ledOn = !ledOn;

    }, length);

    socket.on('blink cancel', function(data) {
      clearInterval(blinkID);
    });

  });

  // LED.Fade
  
  socket.on('fade', function(data) {
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

  // RGB.Write
  
  socket.on('rgb write', function(data) {
    var keys = Object.keys(data);
    keys.forEach(function(key){
      board.pinMode(data[key][0], board.MODES.PWM);
      board.analogWrite(data[key][0], gamma[data[key][1]]);
    });

  });

  // RGB.Read
  
  socket.on('rgb read', function(data){
    var pins = data.pins,
        pKeys = Object.keys(pins);

      pKeys.forEach(function(key) {
        var val = board.pins[pins[key]].value;
        socket.emit( 'rgb return ' + key, { type: key, val: val } );
      });
  });

  // RGB.Blink
  
  socket.on('rgb blink', function(data){
    var pinsArray = Object.keys(data.pins),
        length = data.length || 500,
        idsArray = [];
    
    pinsArray.forEach(function(key){
      var ledPin = data.pins[key][0],
          ledOn = true;

      board.pinMode(ledPin, board.MODES.PWM);

      var blinkID = setInterval(function() {
        if (ledOn) {
          board.analogWrite(ledPin, data.pins[key][1]);
        } else {
          board.analogWrite(ledPin, 0);
        }

        ledOn = !ledOn;

      }, length);

      idsArray.push(blinkID);
    });


    socket.on('rgb blink cancel', function(data) {
      idsArray.forEach(function(id) {
        clearInterval(id);
      });
    });
  });

  // RGB.Fade

  socket.on('rgb fade', function(data) {

    var keys = Object.keys(data),
        mult;

    function nextVal(a, b) {
      return a + mult * b;
    }

    keys.forEach(function(key) {
      var el = data[key];

      var time     = el.time,
          start    = el.start,
          stop     = el.stop,
          inc      = el.inc,
          steps    = time / inc,
          span     = Math.abs(start - stop),
          vps      = span / steps,
          val      = start;

      mult = stop > start ? 1 : -1;

      board.pinMode(el.pin, board.MODES.PWM);

      for (var i = 0; i <= steps; i++){
        (function(num){
          setTimeout(function(){
            board.analogWrite(el.pin, val);
            val = nextVal(val, vps);
          }, num * inc);
        })(i);
      }
    });
  });

  // Servo.Range
   
  socket.on('range', function(data){
    board.servoConfig(data.pin, data.range[0], data.range[1])
  });


  // Servo.Sweep
   
  socket.on('sweep', function(data){
    var degrees = 10,
        incrementer = data.inc || 10,
        min = data.min || 0,
        max = data.max || 180;

    board.servoWrite(data.pin, data.min || 0);

    var sweepID = setInterval(function() {
      if (degrees >= max || degrees === min) {
        incrementer *= -1;
      }
      degrees += incrementer;
      board.servoWrite(data.pin, degrees);
    }, 500);

    socket.on('sweep cancel', function(){
      clearInterval(sweepID);
    });
  });

  // Serial listeners

  var sp = require('serialport'),
      SerialPort = sp.SerialPort,
      serialport,
      serialQ = [];

  function serialDispatch(fn, args){
    serialport.isOpen ? fn.apply(null, args) : serialQ.push({ func: fn, args: args });
  }

  var sinit = function(data) {
    serialport = new SerialPort(data.path, data.config);
    serialport.on('open', function(){
      // call eventQ functions
      serialQ.forEach(function(el) {
        el.func.apply(null, el.args);
      });
    });
  };

  var sread = function() {
    function sRead(){
      serialport.on('data', function(data) {
        socket.emit('serial read return', { data: data });
      });
    }
    serialDispatch(sRead);
  };

  var swrite = function(arg) {
    function sWrite() {
      serialport.write(arg, function(err, results) {
        if (err) { console.log('Serial write error', err); }
        socket.emit('serial write return', { results: results });
      });
    }
    serialDispatch(sWrite, arg);
  };

  var slist = function() {
    sp.list(function (err, ports) {
      var portsArr = [];
      ports.forEach(function(port) {
        var inner = {};
        inner.comName = port.comName;
        inner.pnpId = port.pnpId;
        inner.manufacturer = port.manufacturer;
        portsArr.push(inner);
      });
      socket.emit('serial list return', { ports: portsArr });
    });
  };

  socket.on('serial init', sinit);
  socket.on('serial read', sread);
  socket.on('serial write', swrite);
  socket.on('serial list', slist);

});

