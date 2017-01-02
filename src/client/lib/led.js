var utils = require('./socket_utils.js');

/**
 * Adds led-specific methods to pin object. Called via special.
 *
 * @param  {Object} pin
 * @return {Object} mutated pin
 */
function led(pin) {
  utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
  utils.constructFuncs(pin);


  // this is a little hacky but I am only a little sorry
  var blinkCounter = 0;

  pin.on = function() {

    function ledOn() {
      utils.socket.emit('blink cancel');
      if(this.mode !== 'pwm') {
        this.write('HIGH');
      } else {
        this.write(255);
      }
    }

    utils.dispatch(ledOn.bind(this));

  };

  pin.off = function() {

    function ledOff() {
      utils.socket.emit('blink cancel');

      if(this.mode !== 'pwm') {
        this.write('LOW');
      } else {
        this.write(0);
      }
    }

    utils.dispatch(ledOff.bind(this));

  };

  /**
   * Prepares and emits the fade event. The actual math is
   * taken care of in the server LED file.
   *
   * @param  {Number} start             Initial PWM value
   * @param  {Number} stop              End PWM value
   * @param  {Number} [totalTime=3000]  Total time for fade, in ms
   * @param  {Number} [increment=200]   Time taken for each step, in ms
   *
   */
  pin.fade = function(start, stop, totalTime, increment) {
    function ledFade() {

      this.mode = 'pwm';

      var totalTime = totalTime || 3000,
          inc       = increment || 200;
      utils.socket.emit('fade', {
        pin: this.pin,
        start: start,
        stop: stop,
        time: totalTime,
        inc: inc });
    }

    utils.dispatch(ledFade.bind(this));
  };

  pin.blink = function(length) {

    function ledBlink() {
      utils.socket.emit('blink', { pin: [this.pin], length: length, id: blinkCounter });
    }

    utils.dispatch(ledBlink.bind(this));

    ++blinkCounter;

  };

  pin.noBlink = function() {

    function ledNoBlink() {
      utils.socket.emit('blink' + blinkCounter + ' cancel');
    }

    utils.dispatch(ledNoBlink);

  };

  return pin;
}

module.exports = led;

