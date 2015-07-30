exports.range = function servoRange(board, socket) {
  socket.on('range', function(data){
    board.servoConfig(data.pin, data.range[0], data.range[1])
  });
};

exports.sweep = function servoSweep(board, socket) {
  socket.on('sweep', function(data){
    var degrees = 10,
        incrementer = data.inc || 10,
        min = data.min || 0,
        max = data.max || 180;

    board.servoWrite(data.pin, data.min || 0);

    var sweepID = setInterval(function() {
      if (degrees >= max || degrees === min) {
        incrementer *= -1;
      }
      degrees += incrementer;
      board.servoWrite(data.pin, degrees);
    }, 500);

    socket.on('sweep cancel', function(){
      clearInterval(sweepID);
    });
  });
}