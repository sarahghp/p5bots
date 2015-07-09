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
        var mode = mode || pin.mode;

        function setVal(data) {
          this.val = data.val;
        };

        pin.read = function(arg) {
          var fire = utils.socketGen(mode, 'read', pin.pin);
          utils.dispatch(fire, arg);
          socket.on('return val', setVal.bind(this));
          return function nextRead(arg){ fire(arg) };
        }

        pin.write = function(arg) {         
          var fire = utils.socketGen(mode, 'write', pin.pin);
           utils.dispatch(fire, arg);
          return function nextWrite(arg){ fire(arg) };
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
          socket.emit('action', {
            action: kind + direction.charAt(0).toUpperCase() + direction.substring(1),
            pin: pin,
            type: direction,
            arg: arg
          });
        }
      }

  };

    return utils;
});