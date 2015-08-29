// LED: Fade the LED
// Diagram: diagrams/led

// Uncomment the lines below to log ports to the console
// p5.serial().list(function(data) {
//   console.log('serial list:');
//   data.ports.forEach(function(port) {
//     console.log(port.comName);
//   });
// });


// Board setup — you may need to change the port
var b = p5.board('/dev/cu.usbmodem1421', 'arduino');

// Fade LED 

var led;

function setup() {
  led = b.pin(9, 'LED');

  createCanvas(300, 200);

  var innerStr = '<p style="font-family:Arial;font-size:12px">'
  innerStr += '<b>&darr;</b> Fade </p>';

  createDiv(innerStr);
}

function keyPressed(){
 if (keyCode === DOWN_ARROW) {
  led.write(200);
  led.fade(200, 0);
 } 
}
