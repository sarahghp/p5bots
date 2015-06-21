/*! p5.sound.js v0.0.0 2015-06-19 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define('p5.sensors', ['p5'], function (p5) { (factory(p5));});
  else if (typeof exports === 'object')
    factory(require('../p5'));
  else
    factory(root['p5']);
}(this, function (p5) {var amdclean = {};
amdclean['src_p5sensors_client'] = function (require) {
  'use strict';
  var socket = io.connect('http://localhost:8000');
  socket.on('hello', function (data) {
    console.log('hello ' + data);
    socket.emit('browser', 'BOWSER');
  });
  var INPUT = 'INPUT', OUTPUT = 'OUTPUT', DIGITAL = 'DIGITAL', LED = 'LED';
  socket.on('connect', function () {
    socket.emit('board object', {
      board: 'arduino',
      port: '/dev/cu.usbmodem1421',
      pin: 9,
      mode: DIGITAL,
      direction: OUTPUT
    });
  });
  socket.on('board ready', function () {
    socket.emit('blink');
  });
}({});
}));