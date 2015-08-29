// Basic: Button Draw
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

// Draw ellipses with a button

var p;

function setup() {
  p = b.pin(9, 'DIGITAL', 'INPUT');
  p.read();

  createCanvas(1200, 300);
  noStroke();

  var innerStr = '<p style="font-family:Arial;font-size:12px">'
  innerStr += 'Press the button</p>';

  createDiv(innerStr);
}

function draw() {
  if (p.val) {
    fill(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    ellipse(Math.random() * width, Math.random() * height, 60, 60);
  }
}