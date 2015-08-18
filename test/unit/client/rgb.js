suite('RGB LED', function() {

  var b = p5.board('/dev/cu.usbmodem1421', 'arduino'),
      rgb = b.pin({red: 9, green: 10, blue: 11, common: 'cathode'}, 'RGBLED');

  test('pin set correctly with full pin names', function() {
    assert.deepEqual(rgb.pin, {red: 9, green: 10, blue: 11, common: 'cathode'});
    assert.equal(rgb.redPin, 9);
    assert.equal(rgb.greenPin, 10);
    assert.equal(rgb.bluePin, 11);
    assert.equal(rgb.common, 'cathode');
    assert.equal(rgb.mode, 'pwm');
    assert.equal(rgb.direction, 'output');
    assert.equal(rgb.special, 'rgbled');
  });

  test('pin set correctly with short pin names', function() {
    rgb = b.pin({r: 9, g: 10, b: 11, c: 'cathode'}, 'RGBLED');
    assert.deepEqual(rgb.pin, {r: 9, g: 10, b: 11, c: 'cathode'});
    assert.equal(rgb.redPin, 9);
    assert.equal(rgb.greenPin, 10);
    assert.equal(rgb.bluePin, 11);
    assert.equal(rgb.common, 'cathode');
    assert.equal(rgb.mode, 'pwm');
    assert.equal(rgb.direction, 'output');
    assert.equal(rgb.special, 'rgbled');
  });

  test('pin set correctly with constant', function() {
    var crgb = b.pin({red: 9, green: 10, blue: 11, common: 'cathode'}, b.RGBLED);
    assert.deepEqual(crgb.pin, {red: 9, green: 10, blue: 11, common: 'cathode'});
    assert.equal(crgb.redPin, 9);
    assert.equal(crgb.greenPin, 10);
    assert.equal(crgb.bluePin, 11);
    assert.equal(crgb.common, 'cathode');
    assert.equal(crgb.mode, 'pwm');
    assert.equal(crgb.direction, 'output');
    assert.equal(crgb.special, 'rgbled');
  });

  test('methods are defined', function() {
    assert.isFunction(rgb.read);
    assert.isFunction(rgb.write);
    assert.isFunction(rgb.on);
    assert.isFunction(rgb.off);
    assert.isFunction(rgb.blink);
    assert.isFunction(rgb.noBlink);
    assert.isFunction(rgb.fade);
  });

  test('write succeeds with p5 rgb color', function() {
    var c = color(255, 204, 0);
    rgb.write(c);
    assert.deepEqual(c, rgb.color);
    assert.deepEqual([255, 204, 0], rgb.writeArray);
  });

  test('write succeeds with p5 hsl color', function() {
    var c = color(255, 204, 0),
        h;
    colorMode(hsla);
    h = color(48, 100, 50);
    rgb.write(h);
    assert.deepEqual(h, rgb.color);
    assert.deepEqual([255, 204, 0], rgb.writeArray); // write array always converts to RGB
  });

  test('write succeeds with array', function() {
    var c = color(255, 204, 0),
        a = [255, 204, 0];
    rgb.write(a);
    assert.deepEqual(c, rgb.color);
    assert.deepEqual(a, rgb.writeArray);
  });

  test('anode write successfully inverts value', function() {
    var anodePin = b.pin({r: 9, g: 10, b: 11, c: 'anode' }, 'RGBLED');
    anodePin.write([255, 204, 0]);
    assert.deepEqual([0, 51, 255], anodePin.writeArray);
  });

  test('read sets callback successfully', function() {
    var log = function(data) {
      console.log(data);
    }
    rgb.read(log);
    assert.equal(rgb.readcb, log);
  });

});