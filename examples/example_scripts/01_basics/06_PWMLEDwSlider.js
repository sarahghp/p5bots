// Basic: PWM LED + Slider
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

// PWM Slider

var slider, pin;

function setup() {
  slider = createSlider(0, 255, 150);
  slider.position = (10, 10);
  pin = b.pin(9, 'PWM', 'OUTPUT');

}

function draw() {
  var val = slider.value();
  pin.write(val);
}