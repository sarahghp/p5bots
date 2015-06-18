var socket = io.connect('http://localhost:8000');
socket.on('hello', function(data){
  console.log('hello ' + data);
  socket.emit('browser', 'BOWSER');
});

socket.on('connect', function(){
  socket.emit('board object', {
    board: 'arduino',
    port: '/dev/cu.usbmodem1421',
    pin: 9
  });
});