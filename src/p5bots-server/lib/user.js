exports.hi = function sayHi(board, socket) {
  socket.on('say hi', function(data){
    console.log('hi', data.message);
  });
};