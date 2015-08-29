/**
 * @module Basic constructors
 */

'use strict';

var utils = require('./lib/socket_utils.js');
var special = require('./lib/special_methods_index.js');
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


