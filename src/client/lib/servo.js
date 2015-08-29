var utils = require('./socket_utils.js');

/**
 * Adds servo-specific methods to pin object. Called via special.
 * Sets default range to 0 to 45. Overwrites default write.
 *
 * @param  {Object} pin
 * @return {Object} mutated pin
 */
function servo(pin) {
  utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
  utils.constructFuncs(pin);
  pin.rangeMin = 0;
  pin.rangeMax = 45;

  // Overwrite defualt write returned from construct funcs with servoWrite
  pin.write = function(arg) {
    var fire = utils.socketGen('servo', 'write', pin);
    utils.dispatch(fire, arg);
  };

  pin.range = function(arg) {
    this.rangeMin = arg[0];
    this.rangeMax = arg[1];
    function servoRange() {
      utils.socket.emit('range', {
        pin: this.pin,
        range: arg
      });
    }

    utils.dispatch(servoRange.bind(this));

  };

  pin.sweep = function(inc) {
    function servoSweep() {
      utils.socket.emit('sweep', {
        pin: this.pin,
        min: this.rangeMin,
        max: this.rangeMax,
        inc: inc
      });
    }
    utils.dispatch(servoSweep.bind(this));
  };

  pin.noSweep = function() {
    function cancelSweep() {
      utils.socket.emit('sweep cancel');
    }
    utils.dispatch(cancelSweep.bind(this));
  };

  return pin;
}

module.exports = servo;