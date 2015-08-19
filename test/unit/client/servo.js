suite('Servo', function() {
  var b = p5.board('/dev/cu.usbmodem1421', 'arduino'),
      servo = b.pin(9, 'SERVO');

  test('pin set correctly', function() {
    assert.equal(servo.pin, 9);
    assert.equal(servo.mode, 'servo');
    assert.equal(servo.direction, 'output');
    assert.equal(servo.rangeMin, 0);
    assert.equal(servo.rangeMax, 45);
    assert.equal(servo.special, 'servo');
  });

  test('pin set correctly with constant', function() {
    var cservo = b.pin(9, b.SERVO);
    assert.equal(cservo.pin, 9);
    assert.equal(cservo.mode, 'servo');
    assert.equal(cservo.direction, 'output');
    assert.equal(cservo.rangeMin, 0);
    assert.equal(cservo.rangeMax, 45);
    assert.equal(cservo.special, 'servo');
  });

  test('methods are defined', function() {
    assert.isFunction(servo.read);
    assert.isFunction(servo.write);
    assert.isFunction(servo.range);
    assert.isFunction(servo.sweep);
    assert.isFunction(servo.noSweep);
  });

  test('range sets max and min', function() {
    servo.range([10, 180]);
    assert.equal(servo.rangeMin, 10);
    assert.equal(servo.rangeMax, 180);
  });

});