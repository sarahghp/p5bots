var utils = require('./socket_utils.js');

/**
 * Adds temp sensor–specific methods to pin object. Called via special.
 * Always sets pin direction to output.
 *
 * Unlike with other pins, primary methods defined within read callbacks.
 * (see socket_utils.js)
 *
 * @param  {Object} pin
 * @return {Object} mutated pin
 */
function temp(pin) {
  // Unpack pin object, pluck data & reassign pin num to pin.pin for generation
  var settings = pin.pin;
  var pinNum = settings.pin;

  pin._voltsIn = settings.voltsIn;
  pin.pin = pinNum;

  pin.direction = 'input';
  utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
  utils.constructFuncs(pin);

  var tempErr = 'Remember to call read before try to get a temp value.';
  // Actual values set in read callback; see socket_utils, constructFuncs
  pin.C = function() { throw new Error(tempErr); };
  pin.F = function() { throw new Error(tempErr); };
  pin.K = function() { throw new Error(tempErr); };

  return pin;
}

module.exports = temp;