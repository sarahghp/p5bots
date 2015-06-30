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