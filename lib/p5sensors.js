/*! p5.sensors.js v0.0.0 2015-07-06 */
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
amdclean['src_client_special_methods'] = function (require, src_client_socket_utils) {
  var utils = src_client_socket_utils;
  var special = {
      led: function (pin) {
        pin.on = function () {
          if (this.mode !== 'pwm') {
            this.write('HIGH');
          } else {
            this.mode = 'digital';
            this.write = utils.construct('write', 'digital');
            this.read = utils.construct('read', 'digital');
            this.write('HIGH');
          }
        }, pin.off = function () {
          if (this.mode !== 'pwm') {
            this.write('LOW');
          } else {
            this.mode = 'digital';
            this.write = utils.construct('write', 'digital');
            this.read = utils.construct('read', 'digital');
            this.write('LOW');
          }
        }, pin.fade = function (step, val) {
          var step = step || 5;
          this.val = val || 255, function fadeMe() {
            this.write(this.val);
            this.val -= step;
          };
          if (this.mode === 'pwm') {
            fadeMe();
          } else {
            this.mode = 'pwm';
            fadeMe();
          }
        }, pin.blink = function () {
          socket.on('blink id', function (data) {
            this.blinkID = data.id;
          });
          if (this.mode !== 'pwm') {
            socket.emit('blink', { pin: this.pin });
          } else {
            this.mode = 'digital';
            socket.emit('blink', { pin: this.pin });
          }
        }, pin.noBlink = function () {
          if (this.mode !== 'pwm') {
            socket.emit('no blink', { id: this.blinkID });
          } else {
            this.mode = 'digital';
            socket.emit('no blink', { id: this.blinkID });
          }
        };
        return pin;
      }
    };
  return special;
}({}, amdclean['src_client_socket_utils']);
amdclean['src_client_appjs'] = function (require, src_client_socket_utils, src_client_special_methods) {
  'use strict';
  var utils = src_client_socket_utils;
  var special = src_client_special_methods;
  var modeError = 'Please check mode. Value should be \'analog\', \'digital\', or \'pwm\'';
  var _board;
  var eventQ = [];
  var specialMethods = {
      'led': {
        fn: special.led,
        mode: 'digital'
      }
    };
  p5.Board = function (port, type) {
    this.port = port;
    this.type = type.toLowerCase() || 'arduino';
    this.ready = false;
  };
  p5.Pin = function (num, mode, direction) {
    this.pin = num;
    this.direction = direction ? direction.toLowerCase() : 'output';
    this.mode = mode ? mode.toLowerCase() : 'digital';
    if (specialMethods[this.mode]) {
      this.special = this.mode;
      this.mode = specialMethods[this.mode].mode;
    }
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
      _board.ready = true;
      eventQ.forEach(function (el) {
        el.func.apply(null, el.args);
      });
    });
    return _board;
  };
  p5.pin = function (num, mode, direction) {
    var _pin = new p5.Pin(num, mode, direction);
    var init = utils.pinInit(_pin.pin, _pin.mode, _pin.direction);
    var setVal = function (data) {
      this.val = data.val;
    };
    var construct = function (readOrWrite, mode) {
      function returnVal() {
        return utils.socket.on('return val', setVal.bind(this));
      }
      function noop() {
        return;
      }
      var finalFuncs = {
          read: function nextRead(arg) {
            fire(arg);
          },
          write: function nextWrite(arg) {
            fire(arg);
          }
        };
      return function (arg) {
        var fire = utils.socketGen(mode, readOrWrite, _pin.pin);
        _board.ready ? fire(arg) : eventQ.push({
          func: fire,
          args: [arg]
        });
        readOrWrite === 'read' ? returnVal() : noop();
        return finalFuncs[readOrWrite];
      };
    };
    _board.ready ? init() : eventQ.push({
      func: init,
      args: []
    });
    if (_pin.special) {
      _pin.write = construct('write', _pin.mode, _pin);
      _pin.read = construct('read', _pin.mode, _pin);
      specialMethods[_pin.special].fn(_pin);
    } else if (_pin.mode === 'digital' || _pin.mode === 'analog') {
      _pin.write = construct('write', _pin.mode, _pin);
      _pin.read = construct('read', _pin.mode, _pin);
    } else if (_pin.mode === 'pwm') {
      _pin.write = construct('write', 'analog', _pin);
      _pin.read = construct('read', 'analog', _pin);
    } else {
      throw new Error(modeError);
    }
    return _pin;
  };
}({}, amdclean['src_client_socket_utils'], amdclean['src_client_special_methods']);
}));