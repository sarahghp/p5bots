define(function (require) {
    var utils =  {

      boardInit: function(port, type) {
        return socket.emit('board object', {
          board: type,
          port: port
        });
      },

      socketGen: function(kind, direction, pin) {
        return socket.emit('action', {
          action: kind + direction.charAt(0).toUpperCase() + direction.substring(1),
          pin: pin
        });
      }

    };

    return utils;
});