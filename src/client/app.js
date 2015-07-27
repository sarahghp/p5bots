define(function (require) {

  'use strict';

  var utils = require('src/client/socket_utils');
  var special = require('src/client/special_methods_index');
  var modeError = "Please check mode. Value should be 'analog', 'digital', 'pwm', or servo";

  var specialMethods = {
    'button': { fn: special.button, mode: 'digital' },
    'led': { fn: special.led, mode: 'digital' },
    'motor': { fn: special.motor, mode: 'pwm' },
    'rgbled': { fn: special.rgbled, mode: 'pwm' },
    'servo': { fn: special.servo, mode: 'servo' },
    'temp': { fn: special.temp, mode: 'analog' },
    'vres': { fn: special.vres, mode: 'analog' }
  };

  p5.Board = function (port, type){
    this.port = port;
    this.type = type.toLowerCase() || 'arduino';
    // Will be set when board is connected
    this.ready = false;
    this.eventQ = [];
  };

  p5.Pin = function(num, mode, direction){
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

  p5.board = function (port, type){
    utils.board = new p5.Board(port, type);

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

  p5.pin = function(num, mode, direction){
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

  // Serial does not pass through firmata & therefore not through 
  // board & pin constructors
  p5.serial = special.serial;

});

