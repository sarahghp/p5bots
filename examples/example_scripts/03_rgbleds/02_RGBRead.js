// RGB LED: Read
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

var rgb, c;

function setup() {

  createCanvas(300, 200);

  var innerStr = '<p style="font-family:Arial;font-size:12px">'
  innerStr += 'Press any key & check out the console for readings</p>';

  createDiv(innerStr);


  rgb = b.pin({r: 9, g: 10, b: 11}, 'RGBLED');
  c = color(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
  rgb.write(c);
  fill(c);
  noStroke();
  ellipse(80, 80, 40, 40);
}

// On any key press logs the color to the console
function keyPressed(){
  rgb.read(function(val){ console.log(val.toString()); });
}
