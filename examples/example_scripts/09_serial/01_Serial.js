// Serial: Serial
// diagram: none << will read fluctuating ambient values 

// Board setup — you may need to change the port
var b = p5.board('/dev/cu.usbmodem1421', 'arduino');

// Uncomment the lines below to log ports to the console
// p5.serial().list(function(data) {
//   console.log('serial list:');
//   data.ports.forEach(function(port) {
//     console.log(port.comName);
//   });
// });

var serial;

function setup() {
  serial = p5.serial();
  serial.list();

  serial.connect('/dev/cu.usbmodem1421');

  // Open console to read values
  serial.read(function(data){ console.log(data); })
}