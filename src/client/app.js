define(function (require) {

  'use strict';

  var utils = require('src/client/socket_utils');
  var special = require('src/client/special_methods');
  var modeError = "Please check mode. Value should be 'analog', 'digital', or 'pwm'";
  var _board;
  var eventQ = [];

  var specialMethods = {
    'led': { fn: special.led, mode: 'digital' }
  };

  p5.Board = function (port, type){
    this.port = port;
    this.type = type.toLowerCase() || 'arduino';
    // Will be set when board is connected
    this.ready = false;
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
    _board = new p5.Board(port, type);

    // also emit board object & listen for return
    utils.boardInit(port, type);
    utils.socket.on('board ready', function(){
     _board.ready = true;
     eventQ.forEach(function(el){
      el.func.apply(null, el.args);
     });
    });
     
    return _board;
  };

  p5.pin = function(num, mode, direction){
    var _pin = new p5.Pin(num, mode, direction);
    var init = utils.pinInit(_pin.pin, _pin.mode, _pin.direction);
    
    var setVal = function(data){
          this.val = data.val;
    };

    var construct = function(readOrWrite, mode) {

      function returnVal() {
        return utils.socket.on('return val', setVal.bind(this));
      }

      function noop() {
        return;
      }

      var finalFuncs = {
        read: function nextRead(arg){ fire(arg) },
        write: function nextWrite(arg){ fire(arg) }
      }

      return function(arg) {
        var fire = utils.socketGen(mode, readOrWrite, _pin.pin);
        _board.ready ? fire(arg) : eventQ.push({func: fire, args: [arg]});
        readOrWrite === 'read' ? returnVal() : noop();
        return finalFuncs[readOrWrite];
      }
    }

    _board.ready ? init() 
                 : eventQ.push({
                    func: init,
                    args: []
                  }); 
    
    // add basic methods based on mode
    
    if (_pin.special) {

      console.log('ELSEIF CALLED');
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

});