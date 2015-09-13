// Button: Button Plus
// Diagram: diagrams/button_plus

// Uncomment the lines below to log ports to the console
// p5.serial().list(function(data) {
//   console.log('serial list:');
//   data.ports.forEach(function(port) {
//     console.log(port.comName);
//   });
// });

// Board setup — you may need to change the port
var b = p5.board('/dev/cu.usbmodem1421', 'arduino');

// Draw ellipses with a button

var w = 1200,
    h = 300,
    button, potent;

function setup() {
  // Init button read pin and start read function, 
  // which will change p.val when the read val changes
  button = b.pin(9, 'DIGITAL', 'INPUT');
  button.read();

  // Init potentiometer
  potent = b.pin(0, 'VRES');
  potent.read();

  console.log(button, potent);

  // Create the base canvas
  createCanvas(w, h);
  noStroke();

  // Add instructions
  var innerStr = '<p style="font-family:Arial;font-size:12px">'
  innerStr += 'Press the button to draw. Turn the knob for size.</p>';

  createDiv(innerStr);
}

function draw() {
  // Create ellipse frame and draw to it if button.val = 1;
  var frameW = w - (1/3 * w),
      frameH = h,
      r      = potent.val/2 || 60;
  
  // console.log(button.val);

  if (button.val) {
    fill(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    ellipse(Math.random() * frameW, Math.random() * frameH, r, r);
  }

  // Create ellipse to reflect potentiometer value
  fill(62, 0, 255);
  ellipse(frameW, frameH/2, r, r);
}