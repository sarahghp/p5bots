var utils = require('./socket_utils.js');

/**
 * Adds variable resistor-specific methods to pin object. Called via special.
 *
 * @param  {Object} pin
 * @return {Object} mutated pin
 */
function vres(pin) {

  pin.direction = 'input';
  utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
  utils.constructFuncs(pin);

  pin.range = function(range) {
    var min = range[0],
        max = range[1];

    function vrRange() {
      this.readRange = function() {
        this.val = this.val/1023 * (max - min) + min;
      };
    }

    utils.dispatch(vrRange.bind(this));
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

module.exports = vres;