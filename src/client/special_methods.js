define(function (require) {

  var utils = require('src/client/socket_utils');
  
  var special = {
    led: function(pin) {
      pin.on = function() {
        if(this.mode !== 'pwm') {
          this.write('HIGH');  
        } else {
          this.mode = 'digital';
          this.write = utils.constructFuncs('write', 'digital');
          this.read = utils.constructFuncs('read', 'digital');
          this.write('HIGH')
        } 
      },

      pin.off = function() {
        if(this.mode !== 'pwm') {
          this.write('LOW');  
        } else {
          this.mode = 'digital';
          this.write = utils.constructFuncs('write', 'digital');
          this.read = utils.constructFuncs('read', 'digital');
          this.write('LOW')
        }
      },

      pin.fade = function(step, val) {
        var step = step || 5;
        this.val = val || 255,

        function fadeMe() {
          this.write(this.val);
          this.val -= step;
        }

        if(this.mode === 'pwm') {
          fadeMe()
        } else {
          this.mode = 'pwm';
          // reset read and write
          fadeMe();
        }
      },

      pin.blink = function() {

        if(this.mode !== 'pwm') {
          utils.socket.emit('blink', { pin: this.pin });  
        } else {
          this.mode = 'digital';
          // reset read and write
          utils.socket.emit('blink', { pin: this.pin });
        }
      },

      pin.noBlink = function() {
        if(this.mode !== 'pwm') {
          utils.socket.emit('blink cancel');  
        } else {
          this.mode = 'digital';
          // reset read and write
          utils.socket.emit('blink cancel');
        }
      }

      return pin
    }
  }

  return special;


});