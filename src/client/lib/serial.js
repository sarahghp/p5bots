var utils = require('./socket_utils.js'),
    socket = utils.socket,
    serialObj = {};

/**
 * Serial does not work along the same methods as Firmata-dependent
 * board funcs. It is therefore attached to the top-level p5 Object.
 *
 * @return {Object} Constructed serial instance
 */
var serial = function() {

  /**
   * Passes through data to a node-serialport instatiation
   * @param  {String} path   Port used
   * @param  {Object} config Config options, can use any listed
   *                         for node-serialport
   */
  serialObj.connect = function(path, config) {
    socket.emit('serial init', {
      path: path,
      config: config
    });
  };

  serialObj.read = function(cb) {
    socket.emit('serial read');
    socket.on('serial read return', function(data){
      serialObj.data = data;
      cb(data);
    });
  };

  // Read-event aliases for the old-school among us.
  serialObj.readEvent = serialObj.read;
  serialObj.readData = function(){
    return this.data;
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