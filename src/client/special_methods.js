define(function (require) {

  var utils = require('src/client/socket_utils');
  
  var special = {
    led: function(pin) {
      utils.dispatch(utils.pinInit(pin.pin, pin.mode, pin.direction));
      utils.dispatch(utils.constructFuncs, pin);
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

      pin.blink = function(length) {

        function ledBlink() {
          utils.socket.emit('blink', { pin: this.pin, length: length });
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
      utils.dispatch(utils.constructFuncs, pin);
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
    
      pin.write = function(color) {

        this.color = Array.isArray(color) ?  p5.prototype.color(color) : color;
        this.color.writeArr = [];

        if (this.common === 'anode') {
          this.color.writeArr[0] = 255 - this.color.rgba[0];
          this.color.writeArr[1] = 255 - this.color.rgba[1];
          this.color.writeArr[2] = 255 - this.color.rgba[2];
        } else {
          this.color.writeArr = this.color.rgba;
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
        this.incomingColor = {};

        function rgbRead() {
          if (arg) { this.readcb = arg; }
          utils.socket.emit('rgb read', {
            pins: { red: this.redPin, green: this.greenPin, blue:this.bluePin },
            arg: arg
          });

          function setRGBvals(data){
            this.incomingColor[data.type] = data.val;

            if (Object.keys(this.incomingColor).length === 3) {
              this.color = p5.prototype.color([this.incomingColor.red, this.incomingColor.green, this.incomingColor.blue]);
              this.readcb(this.color);
            }
          }

          utils.socket.on('rgb return red', setRGBvals.bind(this));
          utils.socket.on('rgb return green', setRGBvals.bind(this));
          utils.socket.on('rgb return blue', setRGBvals.bind(this));
        }

        utils.dispatch(rgbRead.bind(this));

      };

      // Reverse high/low values for common anode LEDs
      var zero = pin.common === 'anode' ? 255 : 0,
          top  = pin.common === 'anode' ? 0 : 255;

      pin.on = function() {

        function rgbOn() {
          var setTo = this.offSaved || this.color.writeArr || [top, top, top];
          this.write(setTo);
        }

        utils.dispatch(rgbOn.bind(this));

      };

      pin.off = function() {
        this.offSaved = this.color.writeArr.slice();

        function rgbOff() {
          this.write([zero, zero, zero]);
        }

        utils.dispatch(rgbOff.bind(this));

      };

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