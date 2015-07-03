/*! p5.sensors.js v0.0.0 2015-07-02 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define('p5.sensors', ['p5'], function (p5) { (factory(p5));});
  else if (typeof exports === 'object')
    factory(require('../p5'));
  else
    factory(root['p5']);
}(this, function (p5) {var amdclean = {};
amdclean['src_client_socket_utils'] = function (require) {
  var socket = io.connect('http://localhost:8000/sensors');
  var utils = {
      boardInit: function (port, type) {
        socket.emit('board object', {
          board: type,
          port: port
        });
      },
      pinInit: function (num, mode, direction) {
        return function emitPin() {
          socket.emit('pin object', {
            pin: num,
            mode: mode.toLowerCase(),
            direction: direction.toLowerCase()
          });
        };
      },
      socket: socket,
      socketGen: function (kind, direction, pin) {
        return function action(arg) {
          socket.emit('action', {
            action: kind + direction.charAt(0).toUpperCase() + direction.substring(1),
            pin: pin,
            type: direction,
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
    this.mode = mode ? mode.toLowerCase() : 'digital';
    this.direction = direction ? direction.toLowerCase() : 'output';
    this.write = function () {
      throw new Error(modeError);
    }, this.read = function () {
      throw new Error(modeError);
    };
  };
  p5.board = function (port, type) {
    console.log('p5.board called');
    _board = new p5.Board(port, type);
    utils.boardInit(port, type);
    utils.socket.on('board ready', function () {
      _board.ready = true;
      eventQ.forEach(function (el) {
        el.func.apply(null, el.args);
      });
    });
    return _board;
  };
  p5.pin = function (num, mode, direction) {
    var _pin = new p5.Pin(num, mode, direction);
    var init = utils.pinInit(num, mode, direction);
    var setVal = function (data) {
      this.val = data.val;
    };
    _board.ready ? init() : eventQ.push({
      func: init,
      args: []
    });
    if (_pin.mode === 'digital' || _pin.mode === 'analog') {
      _pin.write = function (arg) {
        var fire = utils.socketGen(_pin.mode, 'write', _pin.pin);
        _board.ready ? fire(arg) : eventQ.push({
          func: fire,
          args: [arg]
        });
        return function nextWrite(arg) {
          fire(arg);
          return nextWrite;
        };
      };
      _pin.read = function (arg) {
        var fire = utils.socketGen(_pin.mode, 'read', _pin.pin);
        _board.ready ? fire(arg) : eventQ.push({
          func: fire,
          args: [arg]
        });
        utils.socket.on('return val', setVal.bind(this));
        return function nextRead(arg) {
          fire(arg);
          return nextRead;
        };
      };
    } else if (_pin.mode === 'pwm') {
      _pin.write = function (arg) {
        var fire = utils.socketGen('analog', 'write', _pin.pin, arg);
        _board.ready ? fire(arg) : eventQ.push({
          func: fire,
          args: [arg]
        });
        return function nextWrite(arg) {
          fire(arg);
          return nextWrite;
        };
      };
      _pin.read = function (arg) {
        var fire = utils.socketGen('analog', 'read', _pin.pin);
        _board.ready ? fire(arg) : eventQ.push({
          func: fire,
          args: [arg]
        });
        utils.socket.on('return val', setVal.bind(this));
        return function nextRead(arg) {
          fire(arg);
          return nextRead;
        };
      };
    } else {
      throw new Error(modeError);
    }
    return _pin;
  };
}({}, amdclean['src_client_socket_utils']);
}));