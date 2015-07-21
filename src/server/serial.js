var socket = require('./app.js').socket;
var sp = require('serialport'),
    SerialPort = sp.SerialPort,
    serialport,
    serialQ = [];

function serialDispatch(fn, args){
  serialport.isOpen ? fn.apply(null, args) : serialQ.push({ func: fn, args: args });
}

exports.init = function(data) {
  serialport = new SerialPort(data.path, data.config);
  serialport.on('open', function(){
    // call eventQ functions
    serialQ.forEach(function(el) {
      el.func.apply(null, el.args);
    });
  });
};

exports.read = function() {
  function sRead(){
    serialport.on('data', function(data){
      socket.emit('serial read return', { data: data });
    });
  }
  serialDispatch(sRead);
};

exports.write = function(arg) {
  function sWrite() {
    serialport.write(arg, function(err, results) {
      if (err) { console.log('Serial write error', err); }
      socket.emit('serial write return', { results: results });
    });
  }
  serialDispatch(sWrite, arg);
};

exports.list = function() {
  serialPort.list(function (err, ports) {
    var portsArr = [];
    ports.forEach(function(port) {
      var inner = {};
      inner.comName = port.comName;
      inner.pnpId = port.pnpId;
      inner.manufacturer = port.manufacturer;
      portsArr.push(inner);
    });
    socket.emit('serial list return', { ports: portsArr });
  });
};