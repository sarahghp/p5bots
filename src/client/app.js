define(function (require) {

  'use strict';

  var utils = require('src/client/socket_utils');
  var modeError = "Please check mode. Value should be 'analog', 'digital', or 'pwm'";
  var _board;
  var eventQ = [];

  p5.Board = function (port, type){
    this.port = port;
    this.type = type.toLowerCase() || 'arduino';
    // Will be set when board is connected
    this.ready = false;
  };

  p5.Pin = function(num, mode, direction){
    this.pin = num;
    this.mode = mode ? mode.toLowerCase() : 'digital';
    this.direction = direction ? direction.toLowerCase() : 'output';

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
    var init = utils.pinInit(num, mode, direction);

    _board.ready ? init() 
                 : eventQ.push({
                    func: init,
                    args: []
                  }); 
    
    // add basic methods based on mode
    if (_pin.mode === 'digital' || _pin.mode === 'analog'){
      _pin.write = function(arg){
        // emits a digital write call
        var fire = utils.socketGen(_pin.mode, 'write', _pin.pin);
        _board.ready ? fire(arg) : eventQ.push({func: fire, args: [arg]});
      };
      _pin.read = function(arg){
        // emits a digital read call
        var fire = utils.socketGen(_pin.mode, 'read', _pin.pin);
         _board.ready ? fire(wrappedArg) : eventQ.push({func: fire, args: [arg]});

        // utils.socket.on('return val', function(data){
        //   this.val = data.val; // will prolly have to use that = this or bind for callsite
        // });
      };
    } else if (_pin.mode === 'pwm'){
      _pin.write = function(){
        // emits a analog write call
        var fire = utils.socketGen('analog', 'write', _pin.pin, arg);
         _board.ready ? fire(arg) : eventQ.push({func: fire, args: [arg]});

      }
      _pin.read = function(){
        // emits a analog read call
        var fire = utils.socketGen('analog', 'read', _pin.pin);
         _board.ready ? fire(arg) : eventQ.push({func: fire, args: [arg]});

        utils.socket.on('return val', function(data){
          this.val = data.val; // will prolly have to use that = this or bind for callsite
        });
      }
    } else {
      throw new Error(modeError);
    }

    return _pin;
  };

});