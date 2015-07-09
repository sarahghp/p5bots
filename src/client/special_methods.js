define(function (require) {

  var utils = require('src/client/socket_utils');
  
  var special = {
    led: function(pin) {
      pin.on = function() {
        if(this.mode !== 'pwm') {
          this.write('HIGH');  
        } else {
          this.mode = 'digital';
          this.write = utils.constructFuncs('write', 'digital'); // rewrite these to use own construction since is obvs ready
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

      // pin.fade = function(step, val) {
      //   var step = step || 5;
      //   var val = val || this.val || 255;

      //   this.val = val;

      //   var fadeMe = function() {
      //     this.write(this.val);
      //     this.val = this.val < 0 ? 255 : this.val - step;
      //   }.bind(this);

      //   if(this.mode === 'pwm') {
      //     fadeMe();
      //   } else {
      //     this.mode = 'pwm';
      //     utils.constructFuncs(this, { ready: true }, 'analog');
      //     fadeMe();
      //   }
      // },
      // 
      
      pin.fade = function(start, stop, totalTime, increment) {
        var totalTime = totalTime || 3000,
            inc       = increment || 200;
        utils.socket.emit('fade', { pin: this.pin, start: start, stop: stop, time: totalTime, inc: inc });
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