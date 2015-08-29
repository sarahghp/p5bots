var utils = require('./socket_utils.js');

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