// LED: Blink the LED
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

// Blink LED 
var led;

function setup() {
  led = b.pin(9, 'LED');

  createCanvas(300, 200);

  var innerStr = '<p style="font-family:Arial;font-size:12px">'
  innerStr += '<b>&larr;</b> LED on &nbsp; | &nbsp;';
  innerStr += '<b>&rarr;</b> LED off &nbsp; | &nbsp;';
  innerStr += '<b>&uarr;</b> Blink LED &nbsp; | &nbsp;';
  innerStr += '<b>&darr;</b> Stop Blinking </p>';

  createDiv(innerStr);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW){
    led.on();
  } else if (keyCode === RIGHT_ARROW) {
    led.off();
  } else if (keyCode === UP_ARROW){
    led.blink();
  } else if (keyCode === DOWN_ARROW) {
    led.noBlink();
  }
}