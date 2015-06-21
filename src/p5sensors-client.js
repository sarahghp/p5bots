define(function (require) {

  'use strict';

  var socket = io.connect('http://localhost:8000');
  socket.on('hello', function(data){
    console.log('hello ' + data);
    socket.emit('browser', 'BOWSER');
  });

  // Constants
  var INPUT   = 'INPUT',
      OUTPUT  = 'OUTPUT',
      DIGITAL = 'DIGITAL',
      LED     = 'LED'


  // Pretend api codes
  // board('arduino', '/dev/cu.usbmodem1421');
  // var led = pin(9, DIGITAL, OUTPUT) /* OR */ pin(9, LED, OUTPUT);
  // led.blink()


  socket.on('connect', function(){
    socket.emit('board object', {
      board: 'arduino',
      port: '/dev/cu.usbmodem1421',
      pin: 9,
      mode: DIGITAL,
      direction: OUTPUT
    });
  });

  // all operation emits should come on board ready
  socket.on('board ready', function(){
    socket.emit('blink');
  });
});