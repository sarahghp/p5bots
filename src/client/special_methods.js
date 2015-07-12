define(function (require) {

  var utils = require('src/client/socket_utils');
  
  var special = {
    led: function(pin) {
      pin.on = function() {
        
        function ledOn() {
          if(this.mode !== 'pwm') {
            this.write('HIGH');  
          } else {
            this.write(255)
          } 
        }

        utils.dispatch(ledOn.bind(this));
        
      },

      pin.off = function() {

        function ledOff() {
          if(this.mode !== 'pwm') {
            this.write('LOW');  
          } else {
            this.write(0);
          }
        }

        utils.dispatch(ledOff.bind(this));

      },
      
      pin.fade = function(start, stop, totalTime, increment) {
        function ledFade() {
          var totalTime = totalTime || 3000,
              inc       = increment || 200;
          utils.socket.emit('fade', { pin: this.pin, start: start, stop: stop, time: totalTime, inc: inc });
        }

        utils.dispatch(ledFade.bind(this));
      },

      pin.blink = function() {

        function ledBlink() {
          utils.socket.emit('blink', { pin: this.pin });
        }

        utils.dispatch(ledBlink.bind(this));
        
      },

      pin.noBlink = function() {
 
        function ledNoBlink() {
          utils.socket.emit('blink cancel');
        }

        utils.dispatch(ledNoBlink);

      }

      return pin
    },

    motor: function(pin) {
      pin.on = function() {
        
        function motorOn() {
          if(this.mode !== 'pwm') {
            this.write('HIGH');  
          } else {
            this.write(255)
          } 
        }

        utils.dispatch(motorOn.bind(this));
        
      },

      pin.off = function() {

        function motorOff() {
          if(this.mode !== 'pwm') {
            this.write('LOW');  
          } else {
            console.log('motor off called in special');
            this.write(10);
          }
        }

        utils.dispatch(motorOff.bind(this));

      }

      return pin;
    }
  }

  return special;


});