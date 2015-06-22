define(function (require) {

  'use strict';

  var socket = io.connect('http://localhost:8000');

  // Pretend api codes
  // board('arduino', '/dev/cu.usbmodem1421');
  // var led = pin(9, 'DIGITAL', 'OUTPUT') /* OR */ pin(9, 'LED', 'OUTPUT');
  // led.blink()

  p5.Board = function (port, type){
    this.port = port;
    this.type = type.toLowerCase() || 'arduino';
  };

  p5.Pin = function(num, mode, direction){
    this.pin = num;
    this.mode = mode;
    this.direction = direction;

    // use function to add methods based on mode
  };

  p5.board = function (port, type){
    var _board = new p5.Board(port, type);
    
    // also emit board object
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