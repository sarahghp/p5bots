define(function (require) {

  'use strict';

  var utils = require('src/client/socket_utils');
  var special = require('src/client/special_methods');
  var modeError = "Please check mode. Value should be 'analog', 'digital', or 'pwm'";
  // var _board = utils.board;

  var specialMethods = {
    'led': { fn: special.led, mode: 'digital' }
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

    this.write = function() { throw new Error(modeError) },
    this.read = function() { throw new Error(modeError) }
  };

  p5.board = function (port, type){
    utils.board = new p5.Board(port, type);

    // also emit board object & listen for return
    utils.boardInit(port, type);
    utils.socket.on('board ready', function(){
     utils.board.ready = true;
     utils.board.eventQ.forEach(function(el){
      el.func.apply(null, el.args);
     });
    });
     
    return utils.board;
  };

  p5.pin = function(num, mode, direction){
    var _pin = new p5.Pin(num, mode, direction);
    var init = utils.pinInit(_pin.pin, _pin.mode, _pin.direction);
    
    utils.board.ready ? init() 
                 : utils.board.eventQ.push({
                    func: init,
                    args: []
                  }); 
    
    // add basic methods based on mode
    
    if (_pin.special) {

       _pin = utils.constructFuncs(_pin);
       _pin = specialMethods[_pin.special].fn(_pin);

    } else if (_pin.mode === 'digital' || _pin.mode === 'analog') {

      _pin = utils.constructFuncs(_pin);

    } else if (_pin.mode === 'pwm') {

      _pin = utils.constructFuncs(_pin, 'analog');

    } else {

      throw new Error(modeError);

    }

    return _pin;
  };

});

