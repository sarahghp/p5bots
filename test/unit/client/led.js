suite('LED', function() {
  var b = p5.board('/dev/cu.usbmodem1421', 'arduino'),
      led = b.pin(9, 'LED');

  test('pin set correctly', function() {
    assert.equal(led.pin, 9);
    assert.equal(led.mode, 'digital');
    assert.equal(led.direction, 'output');
    assert.equal(led.special, 'led');
  });

  test('pin set correctly with constant', function() {
    var cled = b.pin(9, b.LED);
    assert.equal(cled.pin, 9);
    assert.equal(cled.mode, 'digital');
    assert.equal(cled.direction, 'output');
    assert.equal(cled.special, 'led');
  });

  test('methods are defined', function() {
    assert.isFunction(led.read);
    assert.isFunction(led.write);
    assert.isFunction(led.on);
    assert.isFunction(led.off);
    assert.isFunction(led.blink);
    assert.isFunction(led.noBlink);
    assert.isFunction(led.fade);
  });

  test('fade sets mode to pwm', function() {
    led.fade(200, 0);
    assert.equal(led.mode, 'pwm');
  });

});