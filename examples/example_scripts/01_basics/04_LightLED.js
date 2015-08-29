// Basic: Light LED
// Diagram: diagrams/led


// Board setup — you may need to change the port
var b = p5.board('/dev/cu.usbmodem1421', 'arduino');

// Uncomment the lines below to log ports to the console
// p5.serial().list(function(data) {
//   console.log('serial list:');
//   data.ports.forEach(function(port) {
//     console.log(port.comName);
//   });
// });

// Click the circle to light the LED
 
var pin;

function setup() {
  createCanvas(400, 400);
  noStroke();
  fill(62, 0, 255);
  ellipse(width/2, height/2, 100, 100);
  pin = b.pin(9, 'DIGITAL', 'OUTPUT');
}

function mousePressed() {
  var d = dist(width/2, height/2, mouseX, mouseY);
  if (d < 100) {
    pin.write('HIGH');
  }
}

function mouseReleased() {
  pin.write('LOW');
}