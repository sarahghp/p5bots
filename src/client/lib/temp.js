var utils = require('./lib/socket_utils.js');

function temp(pin) {
  // Unpack pin object, pluck data & reassign pin num to pin.pin for generation 
  var settings = pin.pin;
      
  pin._voltsIn = settings.voltsIn;
  pinNum = settings.pin;
  pin.pin = pinNum;

  pin.direction = 'input';
  utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
  utils.constructFuncs(pin);

  // Actual values set in read callback; see socket_utils, constructFuncs
  this.C = function() { throw new Error('Remember to call read before try to get a temp value.') };
  this.F = function() { throw new Error('Remember to call read before try to get a temp value.') };
  this.K = function() { throw new Error('Remember to call read before try to get a temp value.') };
  

  return pin;
}

module.exports = temp;