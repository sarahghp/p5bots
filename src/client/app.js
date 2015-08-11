'use strict';

var utils = require('./lib/socket_utils.js');
var special = require('./lib/special_methods_index.js');
var modeError = "Please check mode. Value should be 'analog', 'digital', 'pwm', or servo";

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

var Pin = function(num, mode, direction){
  this.pin = num;
  this.direction = direction ? direction.toLowerCase() : 'output';

  this.mode = mode ? mode.toLowerCase() : 'digital';
  
  if (specialMethods[this.mode]) {
    this.special = this.mode;
    this.mode = specialMethods[this.mode].mode;
  }

  this.write = function() { throw new Error('Write undefined') },
  this.read = function() { throw new Error('Read undefined') }
};

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

p5.board = function (port, type){
  utils.board = new Board(port, type);

  // also emit board object & listen for return
  utils.boardInit(port, type);
  utils.socket.on('board ready', function(data) {
   utils.board.ready = true;
   // utils.board.analogPins = data.analogArr;
   utils.board.eventQ.forEach(function(el){
    el.func.apply(null, el.args);
   });
  });
   
  return utils.board;
};

// Serial does not pass through firmata & therefore not through 
// board & pin constructors
p5.serial = special.serial;


