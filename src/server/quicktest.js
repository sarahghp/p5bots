//////////////////////////////
// Server-Side Sandbox     //
/////////////////////////////

// var firmata = require('firmata');
// var gamma   = require('./gamma.js')

// var board = new firmata.Board('/dev/cu.usbmodem1421', function(err){
//   if (err) {
//     throw new Error(err);
//   }

//   console.log('going');

//   board.pinMode(9, board.MODES.PWM);
//   board.pinMode(10, board.MODES.PWM);
//   board.pinMode(11, board.MODES.PWM);

//   board.analogWrite(11, gamma[255]);

//   // setTimeout(function(){
//   //   board.analogWrite(10, 255);
//   // }, 1000);

//   // setTimeout(function(){
//   //   board.analogWrite(11, 255);
//   // }, 2000);
  
//   // board.pinMode(9, board.MODES.PWM);
//   // board.analogWrite(9, 0);


// });

//////////////////////////////
// Client-Side Sandbox     //
/////////////////////////////

console.log('quicktest');
// p5.board('/dev/cu.usbmodem1421', 'arduino');


//////////////////////
// Example Scripts //
//////////////////////

// // Board setup — obviously you may need to change the port
// p5.board('/dev/cu.usbmodem1421', 'arduino');

// // Test digital write
// var p = p5.pin(9, 'DIGITAL', 'OUTPUT');
// p.write('HIGH');

// Test PWM write
// var p = p5.pin(9, 'PWM', 'OUTPUT');
// p.write(80);


// Test digital read -- only uncomment one p.read() at a time
// var p = p5.pin(9, 'DIGITAL', 'INPUT');
// p.read(function(val){console.log(val);});
// p.read();
// setInterval(function() { console.log(p.val) }, 500);

// // Test analog read -- only uncomment one p.read() at a time
// var p = p5.pin(0, 'ANALOG', 'INPUT');
// p.read(function(val){console.log(val);});
// p.read();
// setInterval(function() { console.log(p.val) }, 500);

// Draw ellipses with a button -- these work on the same 
// setup as the pin reads

// var p;

// function setup() {
  
//   p5.board('/dev/cu.usbmodem1421', 'arduino');
//   p = p5.pin(9, 'DIGITAL', 'INPUT');
//   p.read();

//   createCanvas(1200, 500);
//   noStroke();
// }

// function draw() {
//   if (p.val) {
//     fill(Math.random() * 255, Math.random() * 255, Math.random() * 255);
//     ellipse(Math.random() * width, Math.random() * height, 60, 60);
//   }
// }

// Click the circle to light the LED -- this works on the same 
// setup as the pin writes
// var pin;

// function setup() {
//   createCanvas(400, 400);
//   noStroke();
//   fill(62, 0, 255);
//   ellipse(width/2, height/2, 100, 100);

//   p5.board('/dev/cu.usbmodem1421', 'arduino');
//   pin = p5.pin(9, 'DIGITAL', 'OUTPUT');
// }

// function mousePressed() {
//   var d = dist(width/2, height/2, mouseX, mouseY);
//   if (d < 100) {
//     pin.write('HIGH');
//   }
// }

// function mouseReleased() {
//   pin.write('LOW');
// }

// // Click a button to light the LED -- this works on the same 
// // setup as the pin writes & uses the p5.dom lib

// function setup() {
//   createCanvas(400, 400);

//   p5.board('/dev/cu.usbmodem1421', 'arduino');
//   var pin = p5.pin(9, 'DIGITAL', 'OUTPUT');

  
//   var button = createButton('LIGHT THE LED!!');
//   button.position(width/2, height/2);
//   button.mousePressed(function(){
//     pin.write('HIGH');
//   });

//   button.mouseReleased(function(){
//     pin.write('LOW');
//   });
// }

// PWM Slider -- Same setup as above

// var slider, pin;

// function setup() {
//   slider = createSlider(0, 255, 150);
//   slider.position = (10, 10);

//   p5.board('/dev/cu.usbmodem1421', 'arduino');
//   pin = p5.pin(9, 'PWM', 'OUTPUT');

// }

// function draw() {
//   var val = slider.value();
//   pin.write(val);
// }


// // LED On & Off -- Same setup as above

// var led;

// function setup() {
//   p5.board('/dev/cu.usbmodem1421', 'arduino');
//   led = p5.pin(2, 'LED');
//   console.log(led);
// }

// function keyPressed() {
//   if (keyCode === LEFT_ARROW){
//     led.on();
//   } else if (keyCode === RIGHT_ARROW) {
//     led.off();
//   } else if (keyCode === UP_ARROW){
//     led.blink();
//   } else if (keyCode === DOWN_ARROW) {
//     led.noBlink();
//   }
// }

// // LED Fade on Key -- Same setup as above

// var led;

// function setup() {
//   p5.board('/dev/cu.usbmodem1421', 'arduino');
//   led = p5.pin(9, 'LED');
// }

// function keyPressed(){
//  if (keyCode === DOWN_ARROW) {
//   led.write(200);
//   led.fade(200, 0);
//  } 
// }

// // LED Fade in Setup -- Same setup as above [tests queueing]

// function setup() {
//   p5.board('/dev/cu.usbmodem1421', 'arduino');
//   var led = p5.pin(9, 'LED');
//   led.write(200);
//   led.fade(200, 0);
// }
// 


// // RGB LED Write -- Breadboard with common-cathode RGB LED
// plugged into pins 9, 10, 11

// function setup() {
//   p5.board('/dev/cu.usbmodem1421', 'arduino');
//   var rgb = p5.pin({r: 9, g: 10, b: 11}, 'RGBLED');
//   var c = color(65);
//   rgb.write(c);
//   fill(c);
//   noStroke();
//   ellipse(80, 80, 40, 40);
// }

// RGB LED Read -- Same as above

// var rgb, c;

// function setup() {
//   p5.board('/dev/cu.usbmodem1421', 'arduino');
//   rgb = p5.pin({r: 9, g: 10, b: 11}, 'RGBLED');
//   c = color(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
//   rgb.write(c);
//   fill(c);
//   noStroke();
//   ellipse(80, 80, 40, 40);
// }

// function keyPressed(){
//   rgb.read(function(val){ console.log(val.toString()); });
// }

// // RGB LED On/Off/Blink -- Same as above
// var rgb, c;

// function setup() {
//   p5.board('/dev/cu.usbmodem1421', 'arduino');
//   rgb = p5.pin({r: 9, g: 10, b: 11}, 'RGBLED');
//   c = color(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
//   rgb.write(c);
//   fill(c);
//   noStroke();
//   ellipse(80, 80, 40, 40); 
// }

// function keyPressed() {
//   if (keyCode === LEFT_ARROW){
//     rgb.on();
//   } else if (keyCode === RIGHT_ARROW) {
//     rgb.off();
//   } else if (keyCode === UP_ARROW){
//     rgb.blink();
//   } else if (keyCode === DOWN_ARROW) {
//     rgb.noBlink();
//   }
// }

// RGB LED Fade on Key -- Same setup as above

// var rgb;

// function setup() {
//   p5.board('/dev/cu.usbmodem1421', 'arduino');
//   rgb = p5.pin({r: 9, g: 10, b: 11}, 'RGBLED');
//   var c = color(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
//   rgb.write(c);
//   fill(c);
//   noStroke();
//   ellipse(80, 80, 40, 40); 
// }

// function keyPressed(){
//  if (keyCode === DOWN_ARROW) {
//   rgb.write([200, 200, 200]);
//   rgb.fade([200, 0, 3000], [200, 0, 5000, 500], [200, 0, 1000, 50]);
//  } 
// }

// // Motor tests -- Breadboard with motor power keyed to pin 9

// var motor;

// function setup() {
//   p5.board('/dev/cu.usbmodem1421', 'arduino');
//   motor = p5.pin(9, 'MOTOR');
// }

// function keyPressed() {
//   if (keyCode === LEFT_ARROW){
//     motor.on();
//   } else if (keyCode === RIGHT_ARROW) {
//     console.log('motor off called');
//     motor.off();
//   } else if (keyCode === UP_ARROW){
//     motor.write(100);
//   }
// }
 
// Servo Tests -- Servo plugged directly into board and pin 9

// var servo;

// function setup() {
//   p5.board('/dev/cu.usbmodem1421', 'arduino');
//   servo = p5.pin(9, 'SERVO');
//   servo.range([0, 60]);
// }

// function keyPressed() {
//    if (keyCode === LEFT_ARROW) {
//      console.log('l')
//      servo.write(15);
//    } else if (keyCode === RIGHT_ARROW) {
//      console.log('r')
//      servo.write(45);
//    } else if (keyCode === UP_ARROW) {
//      console.log('u')
//      servo.sweep();
//    } else if (keyCode === DOWN_ARROW) {
//      console.log('d')
//      servo.noSweep();
//    } 
// }

// // Button tests -- Same as digital and analog read above

// var button;

// function setup() {

//   createCanvas(600, 200);

//   p5.board('/dev/cu.usbmodem1421', 'arduino');
//   button = p5.pin(9, 'BUTTON');

//   function redEllipse() {
//     console.log('pressed');
//     clear();
//     noStroke();
//     fill(255, 0, 0);
//     ellipse(100, 100, 40, 40);
//   }

//   function blueEllipse() {
//     console.log('released');
//     clear();
//     noStroke();
//     fill(0, 0, 255);
//     ellipse(200, 100, 40, 40);
//   }

//   function greenEllipse() {
//     console.log('held')
//     clear();
//     noStroke();
//     fill(0, 255, 136);
//     ellipse(300, 100, 40, 40);
//   }
  
//   button.read();
//   button.pressed(redEllipse);
//   button.released(blueEllipse);
//   button.held(greenEllipse, 3000);

// }
// 
// Variable Resistor Tests -- Potentiometer hooked up to A0
var pmeter;

function setup() {
  p5.board('/dev/cu.usbmodem1421', 'arduino');
  pmeter = p5.pin(0, 'VRES');

  pmeter.read(function(val){ console.log('pmeter read', val)});
  pmeter.range([10, 400]);
  pmeter.threshold(600);
}

function keyPressed() {
  console.log('is over?', pmeter.val, pmeter.overThreshold());
}

// // Serial Tests

// function setup() {
//   var serial = p5.serial();
//   // serial.list();

//   serial.connect('/dev/cu.usbmodem1421');
//   serial.read(function(data){ console.log(data); })
// }  