define(function (require) {

  'use strict';

  var utils = require('src/client/socket_utils');
  var modeError = "Please check mode. Value should be 'analog', 'digital', or 'pwm'";
  var _board, _pin;



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

    this.write = function() { throw new Error(modeError) },
    this.read = function() { throw new Error(modeError) }
  };

  p5.board = function (port, type){
    _board = new p5.Board(port, type);
    
    // also emit board object & listen for return
    utils.boardInit(port, type);
    utils.socket.on('board ready', function(){
     _board.ready = true;
    });
     
    return _board;
  };

  p5.pin = function(num, mode, direction){
    _pin = new p5.Pin(num, mode, direction);
    // use function to add methods based on mode & direction
    if (_pin.mode === 'digital' || _pin.mode === 'analog'){
      _pin.write = function(){
        // emits a digital write call
        utils.socketGen(_pin.mode, 'write', _pin.pin);
      }
      _pin.read = function(){
        // emits a digital read call
        utils.socketGen(_pin.mode, 'read', _pin.pin);
      }
    } else if (_pin.mode === 'pwm'){
      _pin.write = function(){
        // emits a analog write call
        utils.socketGen('analog', 'write', _pin.pin);
      }
      _pin.read = function(){
        // emits a analog read call
        utils.socketGen('analog', 'read', _pin.pin);
      }
    } else {
      throw new Error(modeError);
    }

    return _pin;
  };



  // Unreconstructed socket stuff
  
  // socket.on('hello', function(data){
  //   console.log('hello ' + data);
  //   socket.emit('browser', 'BOWSER');
  // });

  // socket.on('connect', function(){
  //   socket.emit('board object', {
  //     board: 'arduino',
  //     port: '/dev/cu.usbmodem1421',
  //     pin: 9,
  //     mode: 'DIGITAL',
  //     direction: 'OUTPUT'
  //   });
  // });

  // // all operation emits should come on board ready
  // socket.on('board ready', function(){
  //   socket.emit('blink');
  // });
});