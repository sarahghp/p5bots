var utils = require('./socket_utils.js'),
    socket = utils.socket,
    serialObj = {};

var serial = function() {

  serialObj.connect = function(path, config) {
    socket.emit('serial init', {
      path: path,
      config: config
    });
  }
  
  serialObj.read = function(cb) {
    socket.emit('serial read');
    socket.on('serial read return', function(data){
      cb(data);
    });
  };

  serialObj.write = function(arg, cb) {
    socket.emit('serial write', { arg: arg });
    socket.on('serial write return', function(data){
      cb(data);
    });
  };

  serialObj.list = function(cb) {
    socket.emit('serial list');
    socket.on('serial list return', function(data) {
      console.log(data);
      cb && cb(data);
    });
  };
  
  return serialObj;

};

module.exports = serial;