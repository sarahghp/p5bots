// Button: Button 
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

var k;

function setup() {

 createCanvas(300, 200);

 var innerStr = '<p style="font-family:Arial;font-size:12px">'
 innerStr += 'Check out log to see values</p>';

 createDiv(innerStr);

 k = b.pin(0, 'KNOCK'); // Can also set mode to 'PIEZO'
 k.threshold(200);
 k.read();
}

function draw() {
  console.log('Value:', k.val, 
              'threshold:', k.threshold, 
              'overThreshold?:', k.overThreshold());
}