var socket = io.connect('http://localhost:8000');
socket.on('hello', function(data){
  console.log('hello ' + data);
  socket.emit('browser', 'BOWSER');
});