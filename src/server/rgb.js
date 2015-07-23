var gamma = require('./gamma.js');

exports.write = function rgbWrite(board, socket) {
  socket.on('rgb write', function(data) {
    var keys = Object.keys(data);
    keys.forEach(function(key){
      board.pinMode(data[key][0], board.MODES.PWM);
      board.analogWrite(data[key][0], gamma[data[key][1]]);
    });

  });
};

exports.read = function rgbRead(board, socket) {
  socket.on('rgb read', function(data){
    var pins = data.pins,
        pKeys = Object.keys(pins);

      pKeys.forEach(function(key) {
        var val = board.pins[pins[key]].value;
        socket.emit( 'rgb return ' + key, { type: key, val: val } );
      });
  });
};

exports.blink = function rgbBlink(board, socket) {

  socket.on('rgb blink', function(data){
    var pinsArray = Object.keys(data.pins),
        length = data.length || 500,
        idsArray = [];
    
    pinsArray.forEach(function(key){
      var ledPin = data.pins[key][0],
          ledOn = true;

      board.pinMode(ledPin, board.MODES.PWM);

      var blinkID = setInterval(function() {
        if (ledOn) {
          board.analogWrite(ledPin, gamma[data.pins[key][1]]);
        } else {
          board.analogWrite(ledPin, 0);
        }

        ledOn = !ledOn;

      }, length);

      idsArray.push(blinkID);
    });


    socket.on('rgb blink cancel', function(data) {
      idsArray.forEach(function(id) {
        clearInterval(id);
      });
    });
  });
};

exports.fade = function rgbFade(board, socket) {
  socket.on('rgb fade', function(data) {

    var keys = Object.keys(data),
        mult;

    function nextVal(a, b) {
      return a + mult * b;
    }

    keys.forEach(function(key) {
      var el = data[key];

      var time     = el.time,
          start    = el.start,
          stop     = el.stop,
          inc      = el.inc,
          steps    = time / inc,
          span     = Math.abs(start - stop),
          vps      = span / steps,
          val      = start;

      mult = stop > start ? 1 : -1;

      board.pinMode(el.pin, board.MODES.PWM);

      for (var i = 0; i <= steps; i++){
        (function(num){
          setTimeout(function(){
            board.analogWrite(el.pin, gamma[val]);
            val = nextVal(val, vps);
          }, num * inc);
        })(i);
      }
    });
  });
};