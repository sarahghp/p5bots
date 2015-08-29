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

// Test Pressed, Held, Released

var button;

function setup() {
  createCanvas(600, 200);

  var innerStr = '<p style="font-family:Arial;font-size:12px">'
  innerStr += 'Press for Red &nbsp; | &nbsp;';
  innerStr += 'Release for Blue &nbsp; | &nbsp;';
  innerStr += 'Hold for Green </p>';

  createDiv(innerStr);

  
  button = b.pin(9, 'BUTTON');

  function redEllipse() {
    console.log('pressed');
    clear();
    noStroke();
    fill(255, 0, 0);
    ellipse(100, 100, 40, 40);
  }

  function blueEllipse() {
    console.log('released');
    clear();
    noStroke();
    fill(0, 0, 255);
    ellipse(200, 100, 40, 40);
  }

  function greenEllipse() {
    console.log('held')
    clear();
    noStroke();
    fill(0, 255, 136);
    ellipse(300, 100, 40, 40);
  }
  
  button.read();
  button.pressed(redEllipse);
  button.released(blueEllipse);
  button.held(greenEllipse, 1000);

}