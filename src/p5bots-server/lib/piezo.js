var Timer = require('nanotimer'),
    tones = require('./tones.js');

exports.tone = function(board, socket) {

  var tmrsArray = [];

  socket.on('tone', function(data) {
    var timer = new Timer(),
        value = 1,
        tone = data.tone;

    if (tones[tone]) {
      tone = tones[tone];
    // checks if the coerced val is NaN
    } else if (+tone !== +tone) {
      throw new Error('Tone must be a note or a number');
    } else {
      tone = +tone;
    }

    tmrsArray.push(timer);

    timer.setInterval(function(){
      // Toggle value
      value = +!value;

      board.digitalWrite(data.pin, value);

      if ((timer.difTime / 1000000) > data.duration) {
        timer.clearInterval();
      }

    }, null, tone + 'u');

  });

  socket.on('cancel tones', function() {
    tmrsArray.forEach(function(tmr){
      tmr.clearInterval();
    });
  });

};