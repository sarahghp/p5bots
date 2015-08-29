exports.blink = function blink(board, socket) {
  socket.on('blink', function(data){
    var ledPin = data.pin,
        ledOn = true,
        length = data.length || 500;

    board.pinMode(ledPin, board.MODES.OUTPUT);

    var blinkID = setInterval(function() {
      if (ledOn) {
        board.digitalWrite(ledPin, board.HIGH);
      } else {
        board.digitalWrite(ledPin, board.LOW);
      }

      ledOn = !ledOn;

    }, length);

    socket.on('blink cancel', function(data) {
      clearInterval(blinkID);
    });

  });
};

exports.fade = function fade(board, socket) {
  socket.on('fade', function(data) {
    board.pinMode(data.pin, board.MODES.PWM);

    var time     = data.time,
        start    = data.start,
        stop     = data.stop,
        inc      = data.inc,
        steps    = time / inc,
        span     = Math.abs(start - stop),
        vps      = span / steps,
        mult     = stop > start ? 1 : -1,
        val      = start;


    function nextVal(a, b) {
      return a + mult * b;
    }

    function setStep(num){
      setTimeout(function(){
        board.analogWrite(data.pin, val);
        val = nextVal(val, vps);
      }, num * inc);
    }

    for (var i = 0; i <= steps; i++){
      setStep(i);
    }
  });
};