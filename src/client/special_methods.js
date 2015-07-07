define(function (require) {

  var utils = require('src/client/socket_utils');
  
  var special = {
    led: function(pin) {
      pin.on = function() {
        if(this.mode !== 'pwm') {
          this.write('HIGH');  
        } else {
          this.mode = 'digital';
          this.write = utils.construct('write', 'digital');
          this.read = utils.construct('read', 'digital');
          this.write('HIGH')
        } 
      },

      pin.off = function() {
        if(this.mode !== 'pwm') {
          this.write('LOW');  
        } else {
          this.mode = 'digital';
          this.write = utils.construct('write', 'digital');
          this.read = utils.construct('read', 'digital');
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

        socket.on('blink id', function(data){
          this.blinkID = data.id;
        });

        if(this.mode !== 'pwm') {
          socket.emit('blink', { pin: this.pin });  
        } else {
          this.mode = 'digital';
          // reset read and write
          socket.emit('blink', { pin: this.pin });
        }
      },

      pin.noBlink = function() {
        if(this.mode !== 'pwm') {
          socket.emit('no blink', { id: this.blinkID });  
        } else {
          this.mode = 'digital';
          // reset read and write
          socket.emit('no blink', { id: this.blinkID });
        }
      }

      return pin
    }
  }

  return special;


});