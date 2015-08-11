var utils = require('./socket_utils.js');

function motor(pin) {
  utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
  utils.constructFuncs(pin);
  pin.on = function() {
    function motorOn() {
      if(this.mode !== 'pwm') {
        this.write('HIGH');  
      } else {
        this.write(255)
      } 
    }
    utils.dispatch(motorOn.bind(this)); 
  };
  
  pin.off = function() {
    function motorOff() {
      if(this.mode !== 'pwm') {
        this.write('LOW');  
      } else {
        // In my test setup, this works whereas writing 0 does not
        this.write(10);
      }
    }
    utils.dispatch(motorOff.bind(this));
  };
  return pin;
 }

module.exports = motor;