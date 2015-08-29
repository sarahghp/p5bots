// RGB LED: Write
// Diagram: diagrams/rgb

// Uncomment the lines below to log ports to the console
// p5.serial().list(function(data) {
//   console.log('serial list:');
//   data.ports.forEach(function(port) {
//     console.log(port.comName);
//   });
// });


// Board setup — you may need to change the port
var b = p5.board('/dev/cu.usbmodem1421', 'arduino');

function setup() {
  var rgb = b.pin({r: 9, g: 10, b: 11}, 'RGBLED');
  var c = color(65);
  rgb.write(c);
  fill(c);
  noStroke();
  ellipse(80, 80, 40, 40);
}