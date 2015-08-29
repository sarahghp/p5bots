// Serial: Serial
// diagram: none << will read fluctuating ambient values 

var serial;

function setup() {
  serial = p5.serial();
  serial.list();

  serial.connect('/dev/cu.usbmodem1421');

  // Open console to read values
  serial.read(function(data){ console.log(data); })
}