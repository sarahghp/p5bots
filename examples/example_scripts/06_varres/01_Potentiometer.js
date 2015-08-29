// Variable Resistor: Potentiometer 
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

// Test Read & Threshold
var pmeter;

function setup() {
  createCanvas(300, 200);

  var innerStr = '<p style="font-family:Arial;font-size:12px">'
  innerStr += 'Check out the console for readings &nbsp; | &nbsp;';
  innerStr += 'Press any key to test threshold </p>';

  createDiv(innerStr);


  pmeter = b.pin(0, 'VRES');
  pmeter.read(function(val){ console.log('pmeter read', val)});
  pmeter.range([10, 400]);
  pmeter.threshold(600);
}

function keyPressed() {
  console.log('is over?', pmeter.val, pmeter.overThreshold());
}