/*! p5.sensors.js v0.0.0 2015-06-22 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define('p5.sensors', ['p5'], function (p5) { (factory(p5));});
  else if (typeof exports === 'object')
    factory(require('../p5'));
  else
    factory(root['p5']);
}(this, function (p5) {var amdclean = {};
amdclean['src_client_appjs'] = function (require) {
  'use strict';
  p5.Board = function (port, type) {
    this.port = port;
    this.type = type.toLowerCase() || 'arduino';
  };
  p5.Pin = function (num, mode, direction) {
    this.pin = num;
    this.mode = mode;
    this.direction = direction;
  };
  p5.board = function (port, type) {
    return new p5.Board(port, type);
  };
  p5.pin = function (num, mode, direction) {
    return new p5.Pin(num, mode, direction);
  };
  var socket = io.connect('http://localhost:8000');
  socket.on('hello', function (data) {
    console.log('hello ' + data);
    socket.emit('browser', 'BOWSER');
  });
  socket.on('connect', function () {
    socket.emit('board object', {
      board: 'arduino',
      port: '/dev/cu.usbmodem1421',
      pin: 9,
      mode: 'DIGITAL',
      direction: 'OUTPUT'
    });
  });
  socket.on('board ready', function () {
    socket.emit('blink');
  });
}({});
}));