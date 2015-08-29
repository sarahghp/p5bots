/**
 *
 * Write your own user-defined functions here;
 * they will be instantiated in app.js, where they
 * will be passed reference to board and socket
 * once these are in existence.
 * Export each function as its own property of the
 * modules object
 * @param  {Object} board  Firmata board instance
 * @param  {Object} socket Socket.io instance
 *
 *
 */
exports.hi = function sayHi(board, socket) {
  socket.on('say hi', function(data){
    console.log('hi', data.message);
  });
};