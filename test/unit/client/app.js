var basicBoard = {
      type: 'arduino',
      port: '/dev/cu.usbmodem1421'
    },
    pinnedBoard = {
      pin: 9,
      mode: 'digital',
      direction: 'output'
    },
    createdBoard = p5.board('/dev/cu.usbmodem1421', 'arduino'),
    createdPin;

suite('p5sensors basic', function() {
  test('can create a board object', function() {
    assert.equal(createdBoard.type, basicBoard.type);
    assert.equal(createdBoard.port, basicBoard.port);
  });

  test('can add a pin', function() {
    createdPin = p5.pin(9, 'DIGITAL', 'OUTPUT');
    assert.equal(createdPin.pin, pinnedBoard.pin);
    assert.equal(createdPin.mode, pinnedBoard.mode);
    assert.equal(createdPin.direction, pinnedBoard.direction);
  });

  test('can add a pin with shorthand', function() {
    createdPin = p5.pin(9);
    assert.equal(createdPin.pin, pinnedBoard.pin);
    assert.equal(createdPin.mode, pinnedBoard.mode);
    assert.equal(createdPin.direction, pinnedBoard.direction);
  });
});


suite('p5sensors digital read & write', function() {
  test('pin read is defined correctly', function() {
    assert.doesNotThrow(Error, createdPin.read(), 
      "Please check mode. Value should be 'analog', 'digital', or 'pwm'");
    assert.equal(createdPin.read().name, 'nextRead');
  });
  test('pin write is defined correctly', function() {
    assert.doesNotThrow(Error, createdPin.write(), 
      "Please check mode. Value should be 'analog', 'digital', or 'pwm'");
    assert.equal(createdPin.write().name, 'nextWrite');
  });
});

suite('p5sensors analog read & write', function() {
  createdPin = p5.pin(9, 'ANALOG', 'INPUT');
  test('pin read is defined correctly', function() {
    assert.doesNotThrow(Error, createdPin.read(), 
      "Please check mode. Value should be 'analog', 'digital', or 'pwm'");
    assert.equal(createdPin.read().name, 'nextRead');
  });
  test('pin write is defined correctly', function() {
    assert.doesNotThrow(Error, createdPin.write(), 
      "Please check mode. Value should be 'analog', 'digital', or 'pwm'");
    assert.equal(createdPin.write().name, 'nextWrite');
  });
});