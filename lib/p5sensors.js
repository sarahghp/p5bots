/*! p5.sensors.js v0.0.0 2015-07-19 */
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
        var mode = mode || pin.mode, pressedOnce = false, timeout;
        function buttonTests(val) {
          if (val === 1) {
            pressedOnce = true;
            this.buttonPressedcb && this.buttonPressedcb();
            timeout = this.buttonHeldcb ? this.buttonHeldcb() : false;
          } else if (val === 0) {
            pressedOnce && this.buttonReleasedcb && this.buttonReleasedcb();
            timeout && clearTimeout(timeout);
          }
        }
        function setVal(data) {
          this.readcb && this.readcb(data.val);
          this.val = data.val;
          if (this.special === 'button') {
            buttonTests.call(this, data.val);
          }
        }
        pin.read = function (arg) {
          var fire = utils.socketGen(mode, 'read', pin);
          utils.dispatch(fire, arg);
          socket.on('return val', setVal.bind(this));
          return function nextRead(arg) {
            fire(arg);
          };
        };
        pin.write = function (arg) {
          var fire = utils.socketGen(mode, 'write', pin);
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
          if (direction === 'read') {
            pin.readcb = arg;
          }
          socket.emit('action', {
            action: kind + direction.charAt(0).toUpperCase() + direction.substring(1),
            pin: pin.pin,
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
      button: function (pin) {
        pin.direction = 'input';
        utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
        utils.constructFuncs(pin);
        pin.pressed = function (cb) {
          function pinPress() {
            this.buttonPressedcb = cb;
          }
          utils.dispatch(pinPress.bind(this));
        };
        pin.released = function (cb) {
          function pinRelease() {
            this.buttonReleasedcb = cb;
          }
          utils.dispatch(pinRelease.bind(this));
        };
        pin.held = function (cb, threshold) {
          function pinHeld() {
            this.buttonHeldcb = function () {
              var timeout = setTimeout(cb, threshold);
              return timeout;
            };
          }
          utils.dispatch(pinHeld.bind(this));
        };
        return pin;
      },
      led: function (pin) {
        utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
        utils.constructFuncs(pin);
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
        pin.blink = function (length) {
          function ledBlink() {
            utils.socket.emit('blink', {
              pin: [this.pin],
              length: length
            });
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
        utils.constructFuncs(pin);
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
        pin.write = function (color) {
          this.color = Array.isArray(color) ? p5.prototype.color(color) : color;
          this.color.writeArr = [];
          if (this.common === 'anode') {
            this.color.writeArr[0] = 255 - this.color.rgba[0];
            this.color.writeArr[1] = 255 - this.color.rgba[1];
            this.color.writeArr[2] = 255 - this.color.rgba[2];
          } else {
            this.color.writeArr = this.color.rgba;
          }
          function rgbWrite() {
            utils.socket.emit('rgb write', {
              red: [
                this.redPin,
                this.color.writeArr[0]
              ],
              green: [
                this.greenPin,
                this.color.writeArr[1]
              ],
              blue: [
                this.bluePin,
                this.color.writeArr[2]
              ]
            });
          }
          utils.dispatch(rgbWrite.bind(this));
        };
        pin.read = function (arg) {
          this.incomingColor = {};
          function rgbRead() {
            if (arg) {
              this.readcb = arg;
            }
            utils.socket.emit('rgb read', {
              pins: {
                red: this.redPin,
                green: this.greenPin,
                blue: this.bluePin
              },
              arg: arg
            });
            function setRGBvals(data) {
              this.incomingColor[data.type] = data.val;
              if (Object.keys(this.incomingColor).length === 3) {
                this.color = p5.prototype.color([
                  this.incomingColor.red,
                  this.incomingColor.green,
                  this.incomingColor.blue
                ]);
                this.readcb(this.color);
              }
            }
            utils.socket.on('rgb return red', setRGBvals.bind(this));
            utils.socket.on('rgb return green', setRGBvals.bind(this));
            utils.socket.on('rgb return blue', setRGBvals.bind(this));
          }
          utils.dispatch(rgbRead.bind(this));
        };
        var zero = pin.common === 'anode' ? 255 : 0, top = pin.common === 'anode' ? 0 : 255;
        pin.on = function () {
          function rgbOn() {
            var setTo = this.offSaved || this.color.writeArr || [
                top,
                top,
                top
              ];
            this.write(setTo);
          }
          utils.dispatch(rgbOn.bind(this));
        };
        pin.off = function () {
          this.offSaved = this.color.writeArr.slice();
          function rgbOff() {
            this.write([
              zero,
              zero,
              zero
            ]);
          }
          utils.dispatch(rgbOff.bind(this));
        };
        pin.blink = function () {
          function rgbBlink() {
            utils.socket.emit('rgb blink', {
              pins: {
                red: [
                  this.redPin,
                  this.color.writeArr[0] || 255
                ],
                green: [
                  this.greenPin,
                  this.color.writeArr[1] || 255
                ],
                blue: [
                  this.bluePin,
                  this.color.writeArr[2] || 255
                ]
              },
              length: length
            });
          }
          utils.dispatch(rgbBlink.bind(this));
        };
        pin.noBlink = function () {
          function rgbNoBlink() {
            utils.socket.emit('rgb blink cancel');
          }
          utils.dispatch(rgbNoBlink);
        };
        pin.fade = function (red, green, blue) {
          function rgbFade() {
            utils.socket.emit('rgb fade', {
              red: {
                pin: this.redPin,
                start: red[0],
                stop: red[1],
                time: red[2] || 3000,
                inc: red[3] || 200
              },
              green: {
                pin: this.greenPin,
                start: green[0],
                stop: green[1],
                time: green[2] || 3000,
                inc: green[3] || 200
              },
              blue: {
                pin: this.bluePin,
                start: blue[0],
                stop: blue[1],
                time: blue[2] || 3000,
                inc: blue[3] || 200
              }
            });
          }
          utils.dispatch(rgbFade.bind(this));
        };
        return pin;
      },
      servo: function (pin) {
        utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
        utils.constructFuncs(pin);
        this.rangeMin = 0;
        this.rangeMax = 45;
        pin.write = function (arg) {
          var fire = utils.socketGen('servo', 'write', pin.pin);
          utils.dispatch(fire, arg);
        };
        pin.range = function (arg) {
          this.rangeMin = arg[0];
          this.rangeMax = arg[1];
          function servoRange() {
            utils.socket.emit('range', {
              pin: this.pin,
              range: arg
            });
          }
          utils.dispatch(servoRange.bind(this));
        };
        pin.sweep = function (inc) {
          function servoSweep() {
            utils.socket.emit('sweep', {
              pin: this.pin,
              min: this.rangeMin,
              max: this.rangeMax,
              inc: inc
            });
          }
          utils.dispatch(servoSweep.bind(this));
        };
        pin.noSweep = function () {
          function cancelSweep() {
            utils.socket.emit('sweep cancel');
          }
          utils.dispatch(cancelSweep.bind(this));
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
  var modeError = 'Please check mode. Value should be \'analog\', \'digital\', \'pwm\', or servo';
  var specialMethods = {
      'button': {
        fn: special.button,
        mode: 'digital'
      },
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
      },
      'servo': {
        fn: special.servo,
        mode: 'servo'
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
      throw new Error('Write undefined');
    }, this.read = function () {
      throw new Error('Read undefined');
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
      specialMethods[_pin.special].fn(_pin);
    } else if (_pin.mode === 'digital' || _pin.mode === 'analog') {
      utils.dispatch(utils.pinInit(_pin.pin, _pin.mode, _pin.direction));
      utils.constructFuncs(_pin);
    } else if (_pin.mode === 'pwm') {
      utils.dispatch(utils.pinInit(_pin.pin, _pin.mode, _pin.direction));
      utils.constructFuncs(_pin, 'analog');
    } else {
      throw new Error(modeError);
    }
    return _pin;
  };
}({}, amdclean['src_client_socket_utils'], amdclean['src_client_special_methods']);
}));