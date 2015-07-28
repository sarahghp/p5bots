define(function (require) {

  var utils = require('src/client/socket_utils');

  function piezo(pin) {
    utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
    utils.constructFuncs(pin);

    // Overwrite read with analog, so it is always read as such
    pin.read = function(arg) {
      function setVal(data) {
        // Callbacks set in socketGen for generic read & in special constructors for special
        this.readcb && this.readcb(data.val);
        this.val = data.val;

        utils.readTests[this.special] && utils.readTests[this.special].call(this, data.val);          
      };

      var fire = utils.socketGen('analog', 'read', pin);
      utils.dispatch(fire, arg);
      utils.socket.on('return val', setVal.bind(this));
      return function nextRead(arg) { fire(arg) };
    };

    pin.tone = function(tone, duration) {
      function piezoTone(){
        utils.socket.emit('tone', { tone: tone, duration: duration, pin: this.pin });
      }

      utils.dispatch(piezoTone.bind(this));
    };

    pin.noTone = function() {
      function piezoNoTone() {
        utils.socket.emit('cancel tones');
      }

      utils.dispatch(piezoNoTone.bind(this));
    };

    pin.threshold = function(thresh) {
      this.threshold = thresh;
      this.overThreshold = function() {
        return this.val > this.threshold ? true : false;
      }
    };

    return pin;
  }

  return piezo;
});