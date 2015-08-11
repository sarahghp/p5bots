var utils = require('./socket_utils.js');

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

