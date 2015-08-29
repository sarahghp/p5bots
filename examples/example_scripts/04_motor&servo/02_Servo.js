// Servo: Servo 
// Diagram: diagrams/servo

// Uncomment the lines below to log ports to the console
// p5.serial().list(function(data) {
//   console.log('serial list:');
//   data.ports.forEach(function(port) {
//     console.log(port.comName);
//   });
// });

// Board setup — you may need to change the port
var b = p5.board('/dev/cu.usbmodem1421', 'arduino');

// Test servo functionality
var servo;

function setup() {
  createCanvas(300, 200);

  var innerStr = '<p style="font-family:Arial;font-size:12px">'
  innerStr += '<b>&larr;</b> To 15 &nbsp; | &nbsp;';
  innerStr += '<b>&rarr;</b> To 45 &nbsp; | &nbsp;';
  innerStr += '<b>&uarr;</b> Sweep &nbsp; | &nbsp;';
  innerStr += '<b>&darr;</b> Stop Sweeping </p>';

  createDiv(innerStr);

  servo = b.pin(9, 'SERVO');
  servo.range([0, 60]);
}

function keyPressed() {
   if (keyCode === LEFT_ARROW) {
     console.log('l')
     servo.write(15);
   } else if (keyCode === RIGHT_ARROW) {
     console.log('r')
     servo.write(45);
   } else if (keyCode === UP_ARROW) {
     console.log('u')
     servo.sweep();
   } else if (keyCode === DOWN_ARROW) {
     console.log('d')
     servo.noSweep();
   } 
}