suite('Variable resistor', function() {
  var b = p5.board('/dev/cu.usbmodem1421', 'arduino'),
      vres = b.pin(0, 'VRES');

  test('pin set correctly', function() {
    assert.equal(vres.pin, 0);
    assert.equal(vres.mode, 'analog');
    assert.equal(vres.direction, 'input');
    assert.equal(vres.special, 'vres');
  });

  test('pin set correctly with constant', function() {
    var cvres = b.pin(0, b.VRES);
    assert.equal(cvres.pin, 0);
    assert.equal(cvres.mode, 'analog');
    assert.equal(cvres.direction, 'input');
    assert.equal(cvres.special, 'vres');
  });

  test('methods are defined', function() {
    assert.isFunction(vres.read);
    assert.isFunction(vres.write);
    assert.isFunction(vres.range);
    assert.isFunction(vres.threshold);
  });

  test('range defines read range function', function() {
    vres.range([10, 400]);
    assert.isFunction(vres.readRange);
  });

  test('threshold sets threshold val and overThreshold method', function() {
    vres.threshold(200);
    assert.isFunction(vres.overThreshold);
    assert.equal(vres.threshold, 200);
  });

});