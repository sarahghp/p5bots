/*! p5bots.js v0.3.2 January 02, 2017 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.p5js = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/**
 * @module Basic constructors
 */

'use strict';

var utils = _dereq_('./lib/socket_utils.js');
var special = _dereq_('./lib/special_methods_index.js');
var modeError = "Please check mode. Value should be 'analog', 'digital', 'pwm', or servo"; // jshint ignore:line


var specialMethods = {
  'button': { fn: special.button, mode: 'digital' },
  'knock': { fn: special.piezo, mode: 'analog' },
  'led': { fn: special.led, mode: 'digital' },
  'motor': { fn: special.motor, mode: 'pwm' },
  'piezo': { fn: special.piezo, mode: 'digital' },
  'rgbled': { fn: special.rgbled, mode: 'pwm' },
  'servo': { fn: special.servo, mode: 'servo' },
  'temp': { fn: special.temp, mode: 'analog' },
  'tone': { fn: special.piezo, mode: 'digital' },
  'vres': { fn: special.vres, mode: 'analog' }
};

/**
 * This is the primary constructor for the board object. It stores the
 * port and type, makes constants available, and initializes the queue.
 * It is called by p5.board.
 *
 * @param {String} port The port to which the microcontroller is connected
 * @param {String} type Type of microcontroller
 */
var Board = function (port, type){
  this.port = port;
  this.type = type.toLowerCase() || 'arduino';

  // Will be set when board is connected
  this.ready = false;
  this.eventQ = [];

  this.pinsArray = [];

  // Constants
  this.HIGH =     'high';
  this.LOW =      'low';

  this.INPUT =    'input';
  this.OUTPUT =   'output';

  this.ANALOG =   'analog';
  this.DIGITAL =  'digital';
  this.PWM =      'pwm';
  this.SERVO =    'servo';

  this.BUTTON =   'button';
  this.KNOCK =    'knock';
  this.LED =      'led';
  this.MOTOR =    'motor';
  this.PIEZO =    'piezo';
  this.RGBLED =   'rgbled';
  this.TEMP =     'temp';
  this.TONE =     'tone';
  this.VRES =     'vres';

};

/**
 * The Pin constructor sets pin defaults and parses for special,
 * or complex, modes
 *
 * @param {Number} num         Pin number on the board
 * @param {String} [mode]      Pin mode: can be basic or complex
 * @param {String} [direction] Input or output
 */
var Pin = function(num, mode, direction){
  this.pin = num;
  this.direction = direction ? direction.toLowerCase() : 'output';

  this.mode = mode ? mode.toLowerCase() : 'digital';

  if (specialMethods[this.mode]) {
    this.special = this.mode;
    this.mode = specialMethods[this.mode].mode;
  }

  this.write = function() { throw new Error('Write undefined'); };
  this.read = function() { throw new Error('Read undefined'); };
};


/**
 * Instantiaties pin, directs construction of helper methods
 * based on mode
 *
 * @param {Number} num         Pin number on the board
 * @param {String} [mode]      Pin mode: can be basic or complex
 * @param {String} [direction] Input or output
 * @return {Object}            Instantiated pin
 */
Board.prototype.pin = function(num, mode, direction){
  var _pin = new Pin(num, mode, direction);

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

  this.pinsArray.push(_pin);

  return _pin;
};


/**
 * p5.board() makes the board object accessible via p5.
 * It must be called to begin communicating with the board
 * for all methods but p5.serial.
 *
 * @param {String} port The port to which the microcontroller is connected
 * @param {String} type Type of microcontroller
 * @return {Object}     Reference to the object as stored in utils.
 *
 */
p5.board = function (port, type){
  utils.board = new Board(port, type);

  // emit board object & listen for return
  utils.boardInit(port, type);
  utils.socket.on('board ready', function(data) {
    utils.board.ready = true;
    utils.board.eventQ.forEach(function(el){
      el.func.apply(null, el.args);
    });
  });

  return utils.board;
};


/**
 * Initializes the serial methods on the base p5 object.
 * Serial does not pass through firmata & therefore not through
 * board & pin constructors
 *
 * @type {function}
 */
p5.serial = special.serial;



},{"./lib/socket_utils.js":9,"./lib/special_methods_index.js":10}],2:[function(_dereq_,module,exports){
var utils = _dereq_('./socket_utils.js');

/**
 * Adds button-specific methods to pin object. Called via special.
 * Always overwrites direction.
 *
 * @param  {Object} pin
 * @return {Object} mutated pin
 */
function button (pin) {

  pin.direction = 'input';

  utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
  utils.constructFuncs(pin);

  pin.pressed = function(cb) {
    function pinPress() {
      this.buttonPressedcb = cb;
    }
    utils.dispatch(pinPress.bind(this));
  };

  pin.released = function(cb) {
    function pinRelease() {
      this.buttonReleasedcb = cb;
    }
    utils.dispatch(pinRelease.bind(this));
  };

  pin.held = function(cb, threshold) {

    function pinHeld() {
      this.buttonHeldcb = function() {
        var timeout = setTimeout(cb, threshold);
        return timeout;
      };
    }

    utils.dispatch(pinHeld.bind(this));

  };

  return pin;
}

module.exports = button;


},{"./socket_utils.js":9}],3:[function(_dereq_,module,exports){
var utils = _dereq_('./socket_utils.js');

/**
 * Adds led-specific methods to pin object. Called via special.
 *
 * @param  {Object} pin
 * @return {Object} mutated pin
 */
function led(pin) {
  utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
  utils.constructFuncs(pin);


  // this is a little hacky but I am only a little sorry
  var blinkCounter = 0;

  pin.on = function() {

    function ledOn() {
      utils.socket.emit('blink cancel');
      if(this.mode !== 'pwm') {
        this.write('HIGH');
      } else {
        this.write(255);
      }
    }

    utils.dispatch(ledOn.bind(this));

  };

  pin.off = function() {

    function ledOff() {
      utils.socket.emit('blink cancel');

      if(this.mode !== 'pwm') {
        this.write('LOW');
      } else {
        this.write(0);
      }
    }

    utils.dispatch(ledOff.bind(this));

  };

  /**
   * Prepares and emits the fade event. The actual math is
   * taken care of in the server LED file.
   *
   * @param  {Number} start             Initial PWM value
   * @param  {Number} stop              End PWM value
   * @param  {Number} [totalTime=3000]  Total time for fade, in ms
   * @param  {Number} [increment=200]   Time taken for each step, in ms
   *
   */
  pin.fade = function(start, stop, totalTime, increment) {
    function ledFade() {

      this.mode = 'pwm';

      var totalTime = totalTime || 3000,
          inc       = increment || 200;
      utils.socket.emit('fade', {
        pin: this.pin,
        start: start,
        stop: stop,
        time: totalTime,
        inc: inc });
    }

    utils.dispatch(ledFade.bind(this));
  };

  pin.blink = function(length) {

    function ledBlink() {
      utils.socket.emit('blink', { pin: [this.pin], length: length, id: blinkCounter });
    }

    utils.dispatch(ledBlink.bind(this));

    ++blinkCounter;

  };

  pin.noBlink = function() {

    function ledNoBlink() {
      utils.socket.emit('blink' + blinkCounter + ' cancel');
    }

    utils.dispatch(ledNoBlink);

  };

  return pin;
}

module.exports = led;


},{"./socket_utils.js":9}],4:[function(_dereq_,module,exports){
var utils = _dereq_('./socket_utils.js');

/**
 * Adds motor-specific methods to pin object. Called via special.
 *
 * @param  {Object} pin
 * @return {Object} mutated pin
 */
function motor(pin) {
  utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
  utils.constructFuncs(pin);

  pin.on = function() {
    function motorOn() {
      if(this.mode !== 'pwm') {
        this.write('HIGH');
      } else {
        this.write(255);
      }
    }
    utils.dispatch(motorOn.bind(this));
  };

  pin.off = function() {
    function motorOff() {
      if(this.mode !== 'pwm') {
        this.write('LOW');
      } else {
        // In my test setup, this works whereas writing 0 does not
        this.write(10);
      }
    }
    utils.dispatch(motorOff.bind(this));
  };
  return pin;
}

module.exports = motor;
},{"./socket_utils.js":9}],5:[function(_dereq_,module,exports){
var utils = _dereq_('./socket_utils.js');

/**
 * Adds piezo-specific methods to pin object. Called via special.
 * Can be called via the PIEZO mode, as well as KNOCK and TONE.
 *
 * Overwrites standard read constructor.
 *
 * @param  {Object} pin
 * @return {Object} mutated pin
 */
function piezo(pin) {
  utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
  utils.constructFuncs(pin);

  // Overwrite read with analog, so it is always read as such
  pin.read = function(arg) {
    function setVal(data) {
      // Callbacks set in socketGen for generic read
      // & in special constructors for special
      this.readcb && this.readcb(data.val);
      this.val = data.val;

      utils.readTests[this.special] &&
        utils.readTests[this.special].call(this, data.val);
    }

    var fire = utils.socketGen('analog', 'read', pin);
    utils.dispatch(fire, arg);
    utils.socket.on('return val', setVal.bind(this));
    return function nextRead(arg) { fire(arg); };
  };

  pin.tone = function(tone, duration) {
    function piezoTone(){
      utils.socket.emit('tone', {
        tone: tone,
        duration: duration,
        pin: this.pin });
    }

    utils.dispatch(piezoTone.bind(this));
  };

  pin.noTone = function() {
    function piezoNoTone() {
      utils.socket.emit('cancel tones');
    }

    utils.dispatch(piezoNoTone.bind(this));
  };

  // Since this method just attaches further properties to the pin
  // it does not run through dispatch
  pin.threshold = function(thresh) {
    this.threshold = thresh;
    this.overThreshold = function() {
      return this.val > this.threshold ? true : false;
    };
  };

  return pin;
}

module.exports = piezo;
},{"./socket_utils.js":9}],6:[function(_dereq_,module,exports){
var utils = _dereq_('./socket_utils.js');

/**
 * Processes & adds rgb led–specific methods to pin object. Called via special.
 * Does not use standard read and write constructors.
 *
 * @param  {Object} pin
 * @return {Object} mutated pin
 */
function rgb(pin) {
  // Unpack pin object & initialize pins
  var settings = pin.pin;

  pin.redPin = settings.r || settings.red;
  pin.greenPin = settings.g || settings.green;
  pin.bluePin = settings.b || settings.blue;
  pin.common = settings.common || settings.c || 'cathode';

  utils.dispatch(utils.pinInit(pin.redPin, pin.mode, pin.direction));
  utils.dispatch(utils.pinInit(pin.greenPin, pin.mode, pin.direction));
  utils.dispatch(utils.pinInit(pin.bluePin, pin.mode, pin.direction));

  /**
   * Unlike other writes, which take a Number or a constant,
   * the RGB LED takes a p5.Color object or an array of
   * three values as an argument. This is also where inversion for
   * anode RGBs is handled.
   *
   * @param  {Object | Array} color p5.Color object or an array of RGB values
   *
   */
  pin.write = function(color) {

    this.color = Array.isArray(color) ?  p5.prototype.color(color) : color;
    this.color.writeArr = [];

    // Invert values for common anode RGBs
    if (this.common === 'anode') {
      this.color.writeArr[0] = 255 - this.color.rgba[0];
      this.color.writeArr[1] = 255 - this.color.rgba[1];
      this.color.writeArr[2] = 255 - this.color.rgba[2];
    } else {
      this.color.writeArr = this.color.rgba;
    }

    function rgbWrite() {
      utils.socket.emit('rgb write', {
        red: [this.redPin, this.color.writeArr[0]],
        green: [this.greenPin, this.color.writeArr[1]],
        blue: [this.bluePin, this.color.writeArr[2]]
      });
    }

    utils.dispatch(rgbWrite.bind(this));

  };

  /**
   * The RGB read reassmbles values returned from each pin into a
   * p5.Color object and then sets both the pin.val property and the
   * pin.color, in addition to calling the user-provided callback
   * with said value
   *
   * @param  {Function} [arg] User-provided callback function
   *
   */
  pin.read = function(arg) {
    this.incomingColor = {};

    function rgbRead() {
      if (arg) { this.readcb = arg; }

      utils.socket.emit('rgb read', {
        pins: { red: this.redPin, green: this.greenPin, blue:this.bluePin },
        arg: arg
      });

      /**
       * This method handles the async reasembly by populating the incoming
       * color property with socket-received values and then triggering cb
       * when complete
       *
       * @param {Object} data Single-pin info returned by pin read on server
       */
      function setRGBvals(data){
        this.incomingColor[data.type] = data.val;

        if (Object.keys(this.incomingColor).length === 3) {
          this.color = p5.prototype.color([
            this.incomingColor.red,
            this.incomingColor.green,
            this.incomingColor.blue]);
          this.readcb(this.color);
        }
      }

      utils.socket.on('rgb return red', setRGBvals.bind(this));
      utils.socket.on('rgb return green', setRGBvals.bind(this));
      utils.socket.on('rgb return blue', setRGBvals.bind(this));
    }

    utils.dispatch(rgbRead.bind(this));

  };

  // Reverse high/low values for common anode LEDs
  var zero = pin.common === 'anode' ? 255 : 0,
      top  = pin.common === 'anode' ? 0 : 255;

  pin.on = function() {

    function rgbOn() {
      utils.socket.emit('rgb blink cancel');
      var setTo = this.offSaved || this.color.writeArr || [top, top, top];
      this.write(setTo);
    }

    utils.dispatch(rgbOn.bind(this));

  };

  pin.off = function() {
    this.offSaved = this.color.writeArr.slice();

    function rgbOff() {
      utils.socket.emit('rgb blink cancel');
      this.write([zero, zero, zero]);
    }

    utils.dispatch(rgbOff.bind(this));

  };


  pin.blink = function() {
    function rgbBlink() {
      utils.socket.emit('rgb blink', {
        pins: {
          red: [this.redPin, this.color.writeArr[0] || 255],
          green: [this.greenPin, this.color.writeArr[1] || 255],
          blue: [this.bluePin, this.color.writeArr[2] || 255]
        },
        length: length
      });
    }

    utils.dispatch(rgbBlink.bind(this));
  };

  pin.noBlink = function() {

    function rgbNoBlink() {
      utils.socket.emit('rgb blink cancel');
    }

    utils.dispatch(rgbNoBlink);

  };

  /**
   * Unpacks fade ararys to send to server, where the math happens :D
   *
   * @param  {Array} red   The 2 required & 2 optional vals, all Numbers:
   *                       start, stop, total run time, increment time,
   *                       the latter two in ms
   * @param  {Arary} green The 2 required & 2 optional vals, all Numbers:
   *                       start, stop, total run time, increment time,
   *                       the latter two in ms
   * @param  {Arary} blue  The 2 required & 2 optional vals, all Numbers:
   *                       start, stop, total run time, increment time,
   *                       the latter two in ms
   *
   */
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
}

module.exports = rgb;

},{"./socket_utils.js":9}],7:[function(_dereq_,module,exports){
var utils = _dereq_('./socket_utils.js'),
    socket = utils.socket,
    serialObj = {};

/**
 * Serial does not work along the same methods as Firmata-dependent
 * board funcs. It is therefore attached to the top-level p5 Object.
 *
 * @return {Object} Constructed serial instance
 */
var serial = function() {

  /**
   * Passes through data to a node-serialport instatiation
   * @param  {String} path   Port used
   * @param  {Object} config Config options, can use any listed
   *                         for node-serialport
   */
  serialObj.connect = function(path, config) {
    socket.emit('serial init', {
      path: path,
      config: config
    });
  };

  serialObj.read = function(cb) {
    socket.emit('serial read');
    socket.on('serial read return', function(data){
      serialObj.data = data;
      cb(data);
    });
  };

  // Read-event aliases for the old-school among us.
  serialObj.readEvent = serialObj.read;
  serialObj.readData = function(){
    return this.data;
  };

  serialObj.write = function(arg, cb) {
    socket.emit('serial write', { arg: arg });
    socket.on('serial write return', function(data){
      cb && cb(data);
    });
  };

  serialObj.list = function(cb) {
    socket.emit('serial list');
    socket.on('serial list return', function(data) {
      console.log(data);
      cb && cb(data.data); // unwrap the data so the client doesn't need to
    });
  };

  return serialObj;

};

module.exports = serial;
},{"./socket_utils.js":9}],8:[function(_dereq_,module,exports){
var utils = _dereq_('./socket_utils.js');

/**
 * Adds servo-specific methods to pin object. Called via special.
 * Sets default range to 0 to 45. Overwrites default write.
 *
 * @param  {Object} pin
 * @return {Object} mutated pin
 */
function servo(pin) {
  utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
  utils.constructFuncs(pin);
  pin.rangeMin = 0;
  pin.rangeMax = 45;

  // Overwrite defualt write returned from construct funcs with servoWrite
  pin.write = function(arg) {
    var fire = utils.socketGen('servo', 'write', pin);
    utils.dispatch(fire, arg);
  };

  pin.range = function(arg) {
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

  pin.sweep = function(inc) {
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

  pin.noSweep = function() {
    function cancelSweep() {
      utils.socket.emit('sweep cancel');
    }
    utils.dispatch(cancelSweep.bind(this));
  };

  return pin;
}

module.exports = servo;
},{"./socket_utils.js":9}],9:[function(_dereq_,module,exports){
var socket = io.connect('http://localhost:8000/sensors');
socket.on('error', function(err){
  console.log(err);
});

var utils =  {

  boardInit: function(port, type) {
    // Board should always immediately fire
    socket.emit('board object', {
      board: type,
      port: port
    });
  },

  // Set by p5.board
  board: undefined,


  /**
   * Workhorse function establishes default read & write for all
   * pins that don't override
   *
   * @param  {Object} pin    Base pin instance
   * @param  {String} [mode] Explicit mode override
   * @return {Object}        Mutated pin
   */
  constructFuncs: function(pin, mode) {

    var mode = mode || pin.mode; // jshint ignore:line

    function setVal(data) {
      // Callbacks set in socketGen for generic read
      // & in special constructors for special
      this.readcb && this.readcb(data.val);
      this.val = data.val;

      utils.readTests[this.special] &&
        utils.readTests[this.special].call(this, data.val);
    }

    pin.read = function(arg) {
      var fire = utils.socketGen(mode, 'read', pin);
      utils.dispatch(fire, arg);
      socket.on('return val' + pin.pin, setVal.bind(this));
      return function nextRead(arg) { fire(arg); };
    };

    pin.write = function(arg) {
      var fire = utils.socketGen(mode, 'write', pin);
      utils.dispatch(fire, arg);
      return function nextWrite(arg) { fire(arg); };
    };

    return pin;
  },

  dispatch: function(fn, arg){
    this.board.ready ?
        fn(arg)
      : this.board.eventQ.push({func: fn, args: [arg]});
  },

  pinInit: function(pin, mode, direction){
    return function emitPin(){
      socket.emit('pin object', {
        pin: pin,
        mode: mode.toLowerCase(),
        direction: direction.toLowerCase()
      });
    };
  },

  /**
   * This is where we put tests for special callbacks, from
   * special modes. Used by setVal() in constructFuncs.
   *
   * @type {Object}
   */
  readTests: {
    button: function buttonTests(val) {
      if (val === 1) {
        this.pressedOnce = true;
        this.buttonPressedcb && this.buttonPressedcb();
        this.timeout = this.buttonHeldcb ? this.buttonHeldcb() : false;
      } else if (val === 0) {
        this.pressedOnce && this.buttonReleasedcb && this.buttonReleasedcb();
        this.timeout && clearTimeout(this.timeout);
      }
    },

    temp: function tempSettings(val){
      var conversions = {
        'CtoF': function(value) {
          return value * 1.8 + 32;
        },
        'CtoK': function(value) {
          return value + 273.15;
        }
      };

      this.C = ((val * ((this._voltsIn * 1000) / 1024)) - 500) / 10;
      this.F = conversions.CtoF(this.C);
      this.K = conversions.CtoK(this.C);
    },

    vres: function vresTests(val){
      this.readRange && this.readRange();
    }
  },

  socket: socket,

  /**
   * Generates generic read and write funcs and emits
   * across the socket
   *
   * @param  {String} kind      digital | analog
   * @param  {String} direction input | output
   * @param  {Number} pin       pin number on board, analog pins can
   *                            just pass the number without A
   *
   */
  socketGen: function(kind, direction, pin) {
    function titleCase(str){
      return str.charAt(0).toUpperCase() + str.substring(1);
    }

    return function action(arg) {
      if (direction === 'read') {
        pin.readcb = arg;
      }
      socket.emit('action', {
        action: kind + titleCase(direction),
        pin: pin.pin,
        type: direction,
        arg: arg
      });
    };
  }

};

module.exports = utils;
},{}],10:[function(_dereq_,module,exports){
// Don't forget to add new files to this sweet table of contents

var special = {

  button: _dereq_('./button.js'),

  led: _dereq_('./led.js'),

  motor: _dereq_('./motor.js'),

  piezo: _dereq_('./piezo.js'),

  rgbled: _dereq_('./rgb.js'),

  serial: _dereq_('./serial.js'),

  servo: _dereq_('./servo.js'),

  temp: _dereq_('./temp.js'),

  vres: _dereq_('./variable_resistor.js')

};

module.exports = special;
},{"./button.js":2,"./led.js":3,"./motor.js":4,"./piezo.js":5,"./rgb.js":6,"./serial.js":7,"./servo.js":8,"./temp.js":11,"./variable_resistor.js":12}],11:[function(_dereq_,module,exports){
var utils = _dereq_('./socket_utils.js');

/**
 * Adds temp sensor–specific methods to pin object. Called via special.
 * Always sets pin direction to output.
 *
 * Unlike with other pins, primary methods defined within read callbacks.
 * (see socket_utils.js)
 *
 * @param  {Object} pin
 * @return {Object} mutated pin
 */
function temp(pin) {
  // Unpack pin object, pluck data & reassign pin num to pin.pin for generation
  var settings = pin.pin;
  var pinNum = settings.pin;

  pin._voltsIn = settings.voltsIn;
  pin.pin = pinNum;

  pin.direction = 'input';
  utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
  utils.constructFuncs(pin);

  var tempErr = 'Remember to call read before try to get a temp value.';
  // Actual values set in read callback; see socket_utils, constructFuncs
  pin.C = function() { throw new Error(tempErr); };
  pin.F = function() { throw new Error(tempErr); };
  pin.K = function() { throw new Error(tempErr); };

  return pin;
}

module.exports = temp;
},{"./socket_utils.js":9}],12:[function(_dereq_,module,exports){
var utils = _dereq_('./socket_utils.js');

/**
 * Adds variable resistor-specific methods to pin object. Called via special.
 *
 * @param  {Object} pin
 * @return {Object} mutated pin
 */
function vres(pin) {

  pin.direction = 'input';
  utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
  utils.constructFuncs(pin);

  pin.range = function(range) {
    var min = range[0],
        max = range[1];

    function vrRange() {
      this.readRange = function() {
        this.val = this.val/1023 * (max - min) + min;
      };
    }

    utils.dispatch(vrRange.bind(this));
  };

  // Since this method just attaches further properties to the pin
  // it does not run through dispatch
  pin.threshold = function(thresh) {
    this.threshold = thresh;
    this.overThreshold = function() {
      return this.val > this.threshold ? true : false;
    };
  };

  return pin;

}

module.exports = vres;
},{"./socket_utils.js":9}]},{},[1])(1)
});