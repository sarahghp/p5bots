// Basic: Digital Read
// Diagram: diagrams/simple_button

// Board setup — you may need to change the port
var b = p5.board('/dev/cu.usbmodem1421', 'arduino');

// Uncomment the lines below to log ports to the console
// p5.serial().list(function(data) {
//   console.log('serial list:');
//   data.ports.forEach(function(port) {
//     console.log(port.comName);
//   });
// });

// Test digital read
var p = b.pin(9, 'DIGITAL', 'INPUT');
p.read(function(val){console.log(val);});

function setup() {

  var innerStr = '<p style="font-family:Arial;font-size:12px">'
  innerStr += 'Check out the console for readings</p>';

  createDiv(innerStr);
}