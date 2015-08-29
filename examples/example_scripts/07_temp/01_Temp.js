// Temp: Temp 
// Diagram: diagrams/temp


// Board setup — you may need to change the port
var b = p5.board('/dev/cu.usbmodem1421', 'arduino');

// Uncomment the lines below to log ports to the console
// p5.serial().list(function(data) {
//   console.log('serial list:');
//   data.ports.forEach(function(port) {
//     console.log(port.comName);
//   });
// });

var thermo;

function setup() {
  createCanvas(300, 200);

  var innerStr = '<p style="font-family:Arial;font-size:12px">'
  innerStr += '<b>&larr;</b> Write F to console &nbsp; | &nbsp;';
  innerStr += '<b>&rarr;</b> Write C to console &nbsp; | &nbsp;';
  innerStr += '<b>&uarr;</b> Write raw value to console &nbsp; | &nbsp;';
  innerStr += '<b>&darr;</b> Write K to console </p>';

  createDiv(innerStr);


  thermo = b.pin({ pin: 0, voltsIn: 5 }, 'TEMP');
  thermo.read();
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    console.log('f');
    console.log(thermo.F);
  } else if (keyCode === RIGHT_ARROW) {
    console.log('c');
    console.log(thermo.C);
  } else if (keyCode === UP_ARROW) {
    console.log('v');
    console.log(thermo.val);
  } else if (keyCode === DOWN_ARROW) {
    console.log('k')
    console.log(thermo.K);
  }
}