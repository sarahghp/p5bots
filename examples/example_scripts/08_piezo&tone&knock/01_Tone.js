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

var t;

function setup() {
  createCanvas(300, 200);

  var innerStr = '<p style="font-family:Arial;font-size:12px">'
  innerStr += '<b>&larr;</b> Write note &nbsp; | &nbsp;';
  innerStr += '<b>&rarr;</b> Write frequency &nbsp; | &nbsp;';
  innerStr += '<b>&uarr;</b> Does nothing! &nbsp; | &nbsp;';
  innerStr += '<b>&darr;</b> No Tone </p>';

  createDiv(innerStr);


  t = b.pin(8, 'TONE'); // Can also set mode to 'PIEZO'
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    console.log('note');
    t.tone('e7', 10000)
  } else if (keyCode === RIGHT_ARROW) {
    console.log('freq');
    t.tone(600, 400);
  } else if (keyCode === UP_ARROW) {
    console.log('up does nothing!!');
    console.log(t);
  } else if (keyCode === DOWN_ARROW) {
    console.log('nT')
    t.noTone();
  }
}