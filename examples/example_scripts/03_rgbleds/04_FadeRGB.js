// RGB LED: Fade the RGB LED
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

var rgb;

function setup() {

  createCanvas(300, 200);

  var innerStr = '<p style="font-family:Arial;font-size:12px">'
  innerStr += '<b>&darr;</b> Fade </p>';

  createDiv(innerStr);

  rgb = b.pin({r: 9, g: 10, b: 11}, 'RGBLED');
  var c = color(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
  rgb.write(c);
  fill(c);
  noStroke();
  ellipse(80, 80, 40, 40);
}

function keyPressed(){
 if (keyCode === DOWN_ARROW) {
  rgb.write([200, 200, 200]);
  rgb.fade([200, 0, 3000], [200, 0, 5000, 50], [200, 0, 1000, 50]);
 } 
}