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
p5.board('/dev/cu.usbmodem1421', 'arduino');

// Test digital write
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