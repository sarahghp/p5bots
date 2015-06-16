var express = require('express'),
    app     = express(),
    server  = require('http').Server(app),
    io      = require('socket.io')(server);

server.listen(8000);

app.use(express.static('src'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.emit('hello', 'tiger');
  socket.on('browser', function(data){
    console.log(data);
  });
});


function stringTest(str){
  return str;
}

console.log(stringTest('woo'));