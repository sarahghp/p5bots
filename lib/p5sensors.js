/*! p5.sensors.js v0.0.0 2015-06-24 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define('p5.sensors', ['p5'], function (p5) { (factory(p5));});
  else if (typeof exports === 'object')
    factory(require('../p5'));
  else
    factory(root['p5']);
}(this, function (p5) {var amdclean = {};
amdclean['src_client_socket_utils'] = function (require) {
  var socket = io.connect('http://localhost:8000');
  var utils = {
      boardInit: function (port, type) {
        socket.emit('board object', {
          board: type,
          port: port
        });
      },
      pinInit: function (num, direction) {
        return function emitPin() {
          socket.emit('pin object', {
            pin: num,
            direction: direction
          });
        };
      },
      socket: socket,
      socketGen: function (kind, direction, pin, arg) {
        return function action() {
          socket.emit('action', {
            action: kind + direction.charAt(0).toUpperCase() + direction.substring(1),
            pin: pin,
            arg: arg
          });
        };
      }
    };
  return utils;
}({});
amdclean['src_client_appjs'] = function (require, src_client_socket_utils) {
  'use strict';
  var utils = src_client_socket_utils;
  var modeError = 'Please check mode. Value should be \'analog\', \'digital\', or \'pwm\'';
  var _board;
  var eventQ = [];
  p5.Board = function (port, type) {
    this.port = port;
    this.type = type.toLowerCase() || 'arduino';
    this.ready = false;
  };
  p5.Pin = function (num, mode, direction) {
    this.pin = num;
    this.mode = mode.toLowerCase();
    this.direction = direction.toLowerCase();
    this.write = function () {
      throw new Error(modeError);
    }, this.read = function () {
      throw new Error(modeError);
    };
  };
  p5.board = function (port, type) {
    _board = new p5.Board(port, type);
    utils.boardInit(port, type);
    utils.socket.on('board ready', function () {
      console.log('in board', _board.ready);
      _board.ready = true;
      console.log('in board', _board.ready);
      eventQ.forEach(function (el) {
        el();
      });
    });
    return _board;
  };
  p5.pin = function (num, mode, direction) {
    var _pin = new p5.Pin(num, mode, direction);
    _board.ready ? utils.pinInit(num, mode, direction)() : eventQ.push(utils.pinInit(num, mode, direction));
    if (_pin.mode === 'digital' || _pin.mode === 'analog') {
      _pin.write = function (arg) {
        utils.socketGen(_pin.mode, 'write', _pin.pin, arg);
      };
      _pin.read = function (arg) {
        utils.socketGen(_pin.mode, 'read', _pin.pin);
        utils.socket.on('return val', function (data) {
          this.val = data.val;
        });
      };
    } else if (_pin.mode === 'pwm') {
      _pin.write = function () {
        utils.socketGen('analog', 'write', _pin.pin, arg);
      };
      _pin.read = function () {
        utils.socketGen('analog', 'read', _pin.pin);
        utils.socket.on('return val', function (data) {
          this.val = data.val;
        });
      };
    } else {
      throw new Error(modeError);
    }
    return _pin;
  };
}({}, amdclean['src_client_socket_utils']);
}));