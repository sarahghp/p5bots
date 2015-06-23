define(function (require) {

  'use strict';

  var socket = io.connect('http://localhost:8000');
  var utils = require('socket_utils');
  var _board;



  p5.Board = function (port, type){
    this.port = port;
    this.type = type.toLowerCase() || 'arduino';
    // Will be set when board is connected
    this.ready = false;
  };

  p5.Pin = function(num, mode, direction){
    this.pin = num;
    this.mode = mode.toLowerCase();
    this.direction = direction;

    var modeError = "Please check mode. Value should be 'analog', 'digital', or 'pwm'";

    this.write = function() { throw new Error(modeError) },
    this.read = function() { throw new Error(modeError) },

    // use function to add methods based on mode & direction
    if (this.mode === 'digital' || this.mode === 'analog'){
      this.write = function(){
        // emits a digital write call
        // utils.socketGen(this.mode, 'write', this.pin);
      }
      this.read = function(){
        // emits a digital read call
        // utils.socketGen(this.mode, 'read', this.pin);
      }
    } else if (this.mode === 'pwm'){
      this.write = function(){
        // emits a analog write call
        // utils.socketGen('analog', 'write', this.pin);
      }
      this.read = function(){
        // emits a analog read call
        // utils.socketGen('analog', 'read', this.pin);
      }
    } else {
      throw new Error(modeError);
    }
  };

  p5.board = function (port, type){
    _board = new p5.Board(port, type);
    
    // also emit board object & listen for return
    // utils.boardInit(port, type);
    // socket.on('board ready', function(){
    //  _board.ready = true;
    // });
     
    return _board;
  };

  p5.pin = function(num, mode, direction){
    return new p5.Pin(num, mode, direction);
  };


  // Unreconstructed socket stuff
  
  socket.on('hello', function(data){
    console.log('hello ' + data);
    socket.emit('browser', 'BOWSER');
  });

  socket.on('connect', function(){
    socket.emit('board object', {
      board: 'arduino',
      port: '/dev/cu.usbmodem1421',
      pin: 9,
      mode: 'DIGITAL',
      direction: 'OUTPUT'
    });
  });

  // all operation emits should come on board ready
  socket.on('board ready', function(){
    socket.emit('blink');
  });
});