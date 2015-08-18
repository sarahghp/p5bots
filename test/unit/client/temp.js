suite('Temp', function() {
  var b = p5.board('/dev/cu.usbmodem1421', 'arduino'),
      temp = b.pin({ pin: 0, voltsIn: 5 }, 'TEMP');

  test('pin set correctly', function() {
    assert.equal(temp.pin, 0);
    assert.equal(temp.mode, 'analog');
    assert.equal(temp.direction, 'input');
    assert.equal(temp._voltsIn, 5);
    assert.equal(temp.special, 'temp');
  });

  test('pin set correctly with constant', function() {
    var ctemp = b.pin({ pin: 0, voltsIn: 5 }, b.TEMP);
    assert.equal(ctemp.pin, 0);
    assert.equal(ctemp.mode, 'analog');
    assert.equal(ctemp.direction, 'input');
    assert.equal(ctemp._voltsIn, 5);
    assert.equal(ctemp.special, 'temp');
  });

  test('methods are defined', function() {
    assert.isFunction(temp.read);
    assert.isFunction(temp.write);
    assert.isFunction(temp.C);
    assert.isFunction(temp.F);
    assert.isFunction(temp.K);
  });
});