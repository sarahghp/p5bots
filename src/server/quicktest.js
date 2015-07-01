//////////////////////////////
// Server-Side Sandbox     //
/////////////////////////////

// var firmata = require('firmata');

// var board = new firmata.Board('/dev/cu.usbmodem1421', function(err){
//   if (err) {
//     throw new Error(err);
//   }

// });

//////////////////////////////
// Client-Side Sandbox     //
/////////////////////////////

console.log('quicktest');
// p5.board('/dev/cu.usbmodem1421', 'arduino');


//////////////////////
// Example Scripts //
//////////////////////

// Board setup — obviously you may need to change the port
// p5.board('/dev/cu.usbmodem1421', 'arduino');

// // Test digital write
// var p = p5.pin(9, 'DIGITAL', 'OUTPUT');
// p.write('HIGH');

// // Test PWM write
// var p = p5.pin(9, 'PWM', 'OUTPUT');
// p.write(150);


// // Test digital read -- only uncomment one p.read() at a time
// var p = p5.pin(9, 'DIGITAL', 'INPUT');
// p.read(["val", "console.log('read val', val)"]);
// p.read();
// setInterval(function() { console.log(p.val) }, 500);

// // Test analog read -- only uncomment one p.read() at a time
// var p = p5.pin(0, 'ANALOG', 'INPUT');
// p.read(["val", "console.log('read val', val)"]);
// p.read();
// setInterval(function() { console.log(p.val) }, 500);

// // Draw ellipses with a button -- these work on the same 
// // setup as the pin reads

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

// // Click the circle to light the LED -- this works on the same 
// // setup as the pin writes
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