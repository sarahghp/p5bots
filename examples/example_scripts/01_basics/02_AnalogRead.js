// Basic: Analog Read
// Diagram: diagrams/potentiometer

// Uncomment the lines below to log ports to the console
// p5.serial().list(function(data) {
//   console.log('serial list:');
//   data.ports.forEach(function(port) {
//     console.log(port.comName);
//   });
// });

// Board setup — you may need to change the port
var b = p5.board('/dev/cu.usbmodem1421', 'arduino');

// Test analog read
var p = b.pin(0, 'ANALOG', 'INPUT');
p.read(function(val){console.log(val);});

function setup() {
  createCanvas(300, 200);

  var innerStr = '<p style="font-family:Arial;font-size:12px">'
  innerStr += 'Check out the console for readings</p>';

  createDiv(innerStr);
}