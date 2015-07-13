define(function (require) {

  var utils = require('src/client/socket_utils');
  
  var special = {
    led: function(pin) {
      utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
      pin = utils.dispatch(utils.constructFuncs(pin));
      pin.on = function() {
        
        function ledOn() {
          if(this.mode !== 'pwm') {
            this.write('HIGH');  
          } else {
            this.write(255)
          } 
        }

        utils.dispatch(ledOn.bind(this));
        
      };

      pin.off = function() {

        function ledOff() {
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
          utils.socket.emit('fade', { pin: this.pin, start: start, stop: stop, time: totalTime, inc: inc });
        }

        utils.dispatch(ledFade.bind(this));
      };

      pin.blink = function() {

        function ledBlink() {
          utils.socket.emit('blink', { pin: this.pin });
        }

        utils.dispatch(ledBlink.bind(this));
        
      };

      pin.noBlink = function() {
 
        function ledNoBlink() {
          utils.socket.emit('blink cancel');
        }

        utils.dispatch(ledNoBlink);

      };

      return pin
    },

    motor: function(pin) {
      utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
      pin = utils.dispatch(utils.constructFuncs(pin));
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
    },

    rgbled: function(pin) {
      // Unpack pin object & initialize pins
      var settings = pin.pin;
      
      pin.redPin = settings.r;
      pin.greenPin = settings.g;
      pin.bluePin = settings.b;
      pin.common = settings.common || settings.c || 'cathode';

      utils.dispatch(utils.pinInit(pin.redPin, pin.mode, pin.direction));
      utils.dispatch(utils.pinInit(pin.greenPin, pin.mode, pin.direction));
      utils.dispatch(utils.pinInit(pin.bluePin, pin.mode, pin.direction));

      // Reverse high/low values for common anode LEDs
      var high = pin.common === 'anode' ? 'LOW' : 'HIGH',
          low  = pin.common === 'anode' ? 'HIGH' : 'LOW',
          zero = pin.common === 'anode' ? 255 : 0,
          top  = pin.common === 'anode' ? 0 : 255;
    
      pin.write = function(color) {

        pin.color = Array.isArray(color) ?  p5.prototype.color(color) : color;
        pin.color.writeArr = [];

        if (pin.common === 'anode') {
          pin.color.writeArr[0] = 255 - pin.color.rgba[0];
          pin.color.writeArr[1] = 255 - pin.color.rgba[1];
          pin.color.writeArr[2] = 255 - pin.color.rgba[2];
        } else {
          pin.color.writeArr = pin.color.rgba;
        }


        function rgbWrite() {
          utils.socket.emit('rgb write', {
            red: [this.redPin, this.color.writeArr[0]],
            green: [this.greenPin, this.color.writeArr[1]],
            blue: [this.bluePin, this.color.writeArr[2]]
          });
        }

         utils.dispatch(rgbWrite.bind(this));

      };

      pin.read = function(arg) {
        function rgbRead() {
          utils.socket.emit('rgb read', {
            pins: { red: this.redPin, green: this.greenPin, blue:this.bluePin },
            arg: arg
          });

          utils.dispatch(rgbRead.bind(this));


          function setRGBvals(data){
            var incomingColor = { };

            incomingColor[data.type] = data.val;

            if (Object.keys(incomingColor).length === 3) {
              this.color = p5.prototype.color([incomingColor.red, incomingColor.green, incomingColor.blue]);
            }
          }

          utils.socket.on('rgb return red', setRGBvals.bind(this));
          utils.socket.on('rgb return green', setRGBvals.bind(this));
          utils.socket.on('rgb return blue', setRGBvals.bind(this));
        }
      }

      // 
      // On
      // If there is already a pin.color, just write that out,
      // otherwise high / 255
      // 
      // Off
      // Just write low / off
      // 
      // Blink
      // No Blink
      // Fade

    


      return pin;
    }


  }

  return special;


});