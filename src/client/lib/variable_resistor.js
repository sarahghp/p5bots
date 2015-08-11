var utils = require('./socket_utils.js');

function vres(pin) {

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

  pin.threshold = function(thresh) {
    this.threshold = thresh;
    this.overThreshold = function() {
      return this.val > this.threshold ? true : false;
    };
  };

  return pin;

}

module.exports = vres;