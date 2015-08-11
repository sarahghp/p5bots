var utils = require('./socket_utils.js');

function led(pin) {
  utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
  utils.constructFuncs(pin);
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

  pin.fade = function(start, stop, totalTime, increment) {
    function ledFade() {
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
      utils.socket.emit('blink', { pin: [this.pin], length: length });
    }

    utils.dispatch(ledBlink.bind(this));

  };

  pin.noBlink = function() {

    function ledNoBlink() {
      utils.socket.emit('blink cancel');
    }

    utils.dispatch(ledNoBlink);

  };

  return pin;
}

module.exports = led;

