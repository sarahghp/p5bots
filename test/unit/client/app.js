var basicBoard = {
      type: 'arduino',
      port: '/dev/cu.usbmodem1421'
    },
    createdBoard = p5.board('/dev/cu.usbmodem1421', 'arduino'),
    createdPin;

suite('p5sensors init', function() {

  var pins = {

    digitalOUT: {
      pin: 9,
      mode: 'digital',
      direction: 'output'
    },

    digitalIN: {
      pin: 9,
      mode: 'digital',
      direction: 'input'
    },

    analog: {
      pin: 0,
      mode: 'analog',
      direction: 'input'
    },

    pwm: {
      pin: 9,
      mode: 'pwm',
      direction: 'output'
    },
  };

  var b = createdBoard;

  test('can create a board object', function() {
    assert.equal(createdBoard.type, basicBoard.type);
    assert.equal(createdBoard.port, basicBoard.port);
  });

  test('can add a pin with shorthand', function() {
    // shorthand pins are by default digital output
    createdPin = createdBoard.pin(9);
    assert.equal(createdPin.pin, pins.digitalOUT.pin);
    assert.equal(createdPin.mode, pins.digitalOUT.mode);
    assert.equal(createdPin.direction, pins.digitalOUT.direction);
  });

  test('can add a digital output pin', function() {
    createdPin = createdBoard.pin(9, 'DIGITAL', 'OUTPUT');
    assert.equal(createdPin.pin, pins.digitalOUT.pin);
    assert.equal(createdPin.mode, pins.digitalOUT.mode);
    assert.equal(createdPin.direction, pins.digitalOUT.direction);

    // now again with constants
    createdPin = createdBoard.pin(9, b.DIGITAL, b.OUTPUT);
    assert.equal(createdPin.pin, pins.digitalOUT.pin);
    assert.equal(createdPin.mode, pins.digitalOUT.mode);
    assert.equal(createdPin.direction, pins.digitalOUT.direction);
  });

  test('can add a digital input pin', function() {
    createdPin = createdBoard.pin(9, 'DIGITAL', 'INPUT');
    assert.equal(createdPin.pin, pins.digitalIN.pin);
    assert.equal(createdPin.mode, pins.digitalIN.mode);
    assert.equal(createdPin.direction, pins.digitalIN.direction);

    // now again with constants
    createdPin = createdBoard.pin(9, b.DIGITAL, b.INPUT);
    assert.equal(createdPin.pin, pins.digitalIN.pin);
    assert.equal(createdPin.mode, pins.digitalIN.mode);
    assert.equal(createdPin.direction, pins.digitalIN.direction);
  });

  test('can add an analog pin', function() {
    createdPin = createdBoard.pin(0, 'ANALOG', 'INPUT');
    assert.equal(createdPin.pin, pins.analog.pin);
    assert.equal(createdPin.mode, pins.analog.mode);
    assert.equal(createdPin.direction, pins.analog.direction);

    // now again with constants
    createdPin = createdBoard.pin(0, b.ANALOG, b.INPUT);
    assert.equal(createdPin.pin, pins.analog.pin);
    assert.equal(createdPin.mode, pins.analog.mode);
    assert.equal(createdPin.direction, pins.analog.direction);
  });

  test('can add a pwm pin', function() {
    createdPin = createdBoard.pin(9, 'PWM', 'OUTPUT');
    assert.equal(createdPin.pin, pins.pwm.pin);
    assert.equal(createdPin.mode, pins.pwm.mode);
    assert.equal(createdPin.direction, pins.pwm.direction);

    // now again with constants
    createdPin = createdBoard.pin(9, b.PWM, b.OUTPUT);
    assert.equal(createdPin.pin, pins.pwm.pin);
    assert.equal(createdPin.mode, pins.pwm.mode);
    assert.equal(createdPin.direction, pins.pwm.direction);

  });

});

var notCreatedErr =  "Please check mode. Value should be 'analog', 'digital', 'pwm', or servo"; // jshint ignore:line

suite('p5sensors digital read & write', function() {
  createdPin = createdBoard.pin(9);

  test('pin read is defined correctly', function() {
    assert.doesNotThrow(Error, createdPin.read(),
      notCreatedErr);
  });

  test('read callback is set', function() {
    var testcb = function(data) {
      console.log('read cb', data);
    };

    var assertion = function(){
      assert.equal(createdPin.readcb, testcb);
      assert.isDefined(createdPin.val);
    };

    createdPin.read(testcb);
    setTimeout(assertion, 1000);

  });

  test('pin write is defined correctly', function() {
    assert.doesNotThrow(Error, createdPin.write(),
      notCreatedErr);
  });
});

suite('p5sensors analog read & write', function() {
  createdPin = createdBoard.pin(9, 'ANALOG', 'INPUT');
  test('pin read is defined correctly', function() {
    assert.doesNotThrow(Error, createdPin.read(),
      notCreatedErr);
  });

  test('read callback is set', function() {
    var testcb = function(data) {
      console.log('read cb', data);
    };

    var assertion = function(){
      assert.equal(createdPin.readcb, testcb);
      assert.isDefined(createdPin.val);
    };

    createdPin.read(testcb);
    setTimeout(assertion, 1000);

  });

  test('pin write is defined correctly', function() {
    assert.doesNotThrow(Error, createdPin.write(),
      notCreatedErr);
  });
});