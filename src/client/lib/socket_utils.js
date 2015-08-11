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

  board: undefined,

  constructFuncs: function(pin, mode) {

    // Let an explicit passed mode override the pin's user-facing mode
    var mode = mode || pin.mode;

    function setVal(data) {
      // Callbacks set in socketGen for generic read & in special constructors for special
      this.readcb && this.readcb(data.val);
      this.val = data.val;

      utils.readTests[this.special] && utils.readTests[this.special].call(this, data.val);          
    };

    pin.read = function(arg) {
      var fire = utils.socketGen(mode, 'read', pin);
      utils.dispatch(fire, arg);
      socket.on('return val', setVal.bind(this));
      return function nextRead(arg) { fire(arg) };
    }

    pin.write = function(arg) {         
      var fire = utils.socketGen(mode, 'write', pin);
      utils.dispatch(fire, arg);
      return function nextWrite(arg) { fire(arg) };
    }

    return pin;
  },

  dispatch: function(fn, arg){
    this.board.ready ? fn(arg) : this.board.eventQ.push({func: fn, args: [arg]});
  },

  pinInit: function(pin, mode, direction){
    return function emitPin(){
      socket.emit('pin object', {
        pin: pin,
        mode: mode.toLowerCase(),
        direction: direction.toLowerCase()
      });
    }
  },

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

  socketGen: function(kind, direction, pin) {
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
    }
  }

};

module.exports = utils;