/*! p5.sensors.js v0.0.0 2015-07-12 */
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
  socket.on('error', function (err) {
    console.log(err);
  });
  var utils = {
      boardInit: function (port, type) {
        socket.emit('board object', {
          board: type,
          port: port
        });
      },
      board: undefined,
      constructFuncs: function (pin, mode) {
        var mode = mode || pin.mode;
        function setVal(data) {
          this.val = data.val;
        }
        pin.read = function (arg) {
          var fire = utils.socketGen(mode, 'read', pin.pin);
          utils.dispatch(fire, arg);
          socket.on('return val', setVal.bind(this));
          return function nextRead(arg) {
            fire(arg);
          };
        };
        pin.write = function (arg) {
          var fire = utils.socketGen(mode, 'write', pin.pin);
          utils.dispatch(fire, arg);
          return function nextWrite(arg) {
            fire(arg);
          };
        };
        return pin;
      },
      dispatch: function (fn, arg) {
        this.board.ready ? fn(arg) : this.board.eventQ.push({
          func: fn,
          args: [arg]
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
        utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
        pin = utils.dispatch(utils.constructFuncs(pin));
        pin.on = function () {
          function ledOn() {
            if (this.mode !== 'pwm') {
              this.write('HIGH');
            } else {
              this.write(255);
            }
          }
          utils.dispatch(ledOn.bind(this));
        };
        pin.off = function () {
          function ledOff() {
            if (this.mode !== 'pwm') {
              this.write('LOW');
            } else {
              this.write(0);
            }
          }
          utils.dispatch(ledOff.bind(this));
        };
        pin.fade = function (start, stop, totalTime, increment) {
          function ledFade() {
            var totalTime = totalTime || 3000, inc = increment || 200;
            utils.socket.emit('fade', {
              pin: this.pin,
              start: start,
              stop: stop,
              time: totalTime,
              inc: inc
            });
          }
          utils.dispatch(ledFade.bind(this));
        };
        pin.blink = function () {
          function ledBlink() {
            utils.socket.emit('blink', { pin: this.pin });
          }
          utils.dispatch(ledBlink.bind(this));
        };
        pin.noBlink = function () {
          function ledNoBlink() {
            utils.socket.emit('blink cancel');
          }
          utils.dispatch(ledNoBlink);
        };
        return pin;
      },
      motor: function (pin) {
        utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
        pin = utils.dispatch(utils.constructFuncs(pin));
        pin.on = function () {
          function motorOn() {
            if (this.mode !== 'pwm') {
              this.write('HIGH');
            } else {
              this.write(255);
            }
          }
          utils.dispatch(motorOn.bind(this));
        };
        pin.off = function () {
          function motorOff() {
            if (this.mode !== 'pwm') {
              this.write('LOW');
            } else {
              this.write(10);
            }
          }
          utils.dispatch(motorOff.bind(this));
        };
        return pin;
      },
      rgbled: function (pin) {
        var settings = pin.pin;
        pin.redPin = settings.r;
        pin.greenPin = settings.g;
        pin.bluePin = settings.b;
        pin.common = settings.common || settings.c || 'cathode';
        utils.dispatch(utils.pinInit(pin.redPin, pin.mode, pin.direction));
        utils.dispatch(utils.pinInit(pin.greenPin, pin.mode, pin.direction));
        utils.dispatch(utils.pinInit(pin.bluePin, pin.mode, pin.direction));
        var high = pin.common === 'anode' ? 'LOW' : 'HIGH', low = pin.common === 'anode' ? 'HIGH' : 'LOW', zero = pin.common === 'anode' ? 255 : 0, top = pin.common === 'anode' ? 0 : 255;
        pin.write = function (color) {
          pin.color = Array.isArray(color) ? p5.prototype.color(color) : color;
          pin.color.writeArr = [];
          if (pin.common === 'anode') {
            pin.color.writeArr[0] = 255 - pin.color.rgba[0];
            pin.color.writeArr[1] = 255 - pin.color.rgba[1];
            pin.color.writeArr[2] = 255 - pin.color.rgba[2];
          } else {
            pin.color.writeArr = pin.color.rgba;
          }
          function rgbWrite() {
            utils.socket.emit('rgb write', {
              red: [
                pin.redPin,
                pin.color.writeArr[0]
              ],
              green: [
                pin.greenPin,
                pin.color.writeArr[1]
              ],
              blue: [
                pin.bluePin,
                pin.color.writeArr[2]
              ]
            });
          }
          utils.dispatch(rgbWrite.bind(this));
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
  var specialMethods = {
      'led': {
        fn: special.led,
        mode: 'digital'
      },
      'motor': {
        fn: special.motor,
        mode: 'pwm'
      },
      'rgbled': {
        fn: special.rgbled,
        mode: 'pwm'
      }
    };
  p5.Board = function (port, type) {
    this.port = port;
    this.type = type.toLowerCase() || 'arduino';
    this.ready = false;
    this.eventQ = [];
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
    utils.board = new p5.Board(port, type);
    utils.boardInit(port, type);
    utils.socket.on('board ready', function () {
      utils.board.ready = true;
      utils.board.eventQ.forEach(function (el) {
        el.func.apply(null, el.args);
      });
    });
    return utils.board;
  };
  p5.pin = function (num, mode, direction) {
    var _pin = new p5.Pin(num, mode, direction);
    if (_pin.special) {
      _pin = specialMethods[_pin.special].fn(_pin);
    } else if (_pin.mode === 'digital' || _pin.mode === 'analog') {
      utils.dispatch(utils.pinInit(_pin.pin, _pin.mode, _pin.direction));
      _pin = utils.constructFuncs(_pin);
    } else if (_pin.mode === 'pwm') {
      utils.dispatch(utils.pinInit(_pin.pin, _pin.mode, _pin.direction));
      _pin = utils.constructFuncs(_pin, 'analog');
    } else {
      throw new Error(modeError);
    }
    return _pin;
  };
}({}, amdclean['src_client_socket_utils'], amdclean['src_client_special_methods']);
}));