define(function (require) {
    
    var socket = io.connect('http://localhost:8000/sensors');
    socket.on('error', function(err){
      console.log(err);
    });

    var utils =  {

      boardInit: function(port, type) {
        // Board should always immediately fire
        socket.emit('board object', {
          board: type,
          port: port
        });
      },

      board: undefined,

      constructFuncs: function(pin, mode) {

        // Let an explicit passed mode override the pin's user-facing mode
        var mode = mode || pin.mode,
            pressedOnce = false,
            timeout;

        function buttonTests(val) {
          if (val === 1) {
            pressedOnce = true;
            this.buttonPressedcb && this.buttonPressedcb();
            timeout = this.buttonHeldcb ? this.buttonHeldcb() : false;
          } else if (val === 0) {
            pressedOnce && this.buttonReleasedcb && this.buttonReleasedcb();
            timeout && clearTimeout(timeout);
          }
        }

        function vresTests(val){
          this.readRange && this.readRange();
        }

        function setVal(data) {
          // Check for callbacks, and if they exist, call them
          // Callbacks set in socketGen for generic read & special calls
          this.readcb && this.readcb(data.val);
          this.val = data.val;

          if (this.special === 'button'){
            buttonTests.call(this, data.val);
          } else if (this.special === 'vres'){
            vresTests.call(this);
          }
          
        };

        pin.read = function(arg) {
          var fire = utils.socketGen(mode, 'read', pin);
          utils.dispatch(fire, arg);
          socket.on('return val', setVal.bind(this));
          return function nextRead(arg) { fire(arg) };
        }

        pin.write = function(arg) {         
          var fire = utils.socketGen(mode, 'write', pin);
          utils.dispatch(fire, arg);
          return function nextWrite(arg) { fire(arg) };
        }

        return pin;
      },

      dispatch: function(fn, arg){
        this.board.ready ? fn(arg) : this.board.eventQ.push({func: fn, args: [arg]});
      },

      pinInit: function(num, mode, direction){
        return function emitPin(){
          socket.emit('pin object', {
            pin: num,
            mode: mode.toLowerCase(),
            direction: direction.toLowerCase()
          });
        }
      },

      socket: socket,

      socketGen: function(kind, direction, pin) {
        return function action(arg) {
          if (direction === 'read') {
            pin.readcb = arg;
          }
          socket.emit('action', {
            action: kind + direction.charAt(0).toUpperCase() + direction.substring(1),
            pin: pin.pin,
            type: direction,
            arg: arg
          });
        }
      }

  };

    return utils;
});