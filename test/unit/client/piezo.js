var b = p5.board('/dev/cu.usbmodem1421', 'arduino'),

suite('Piezo', function() {

  var piezo = b.pin(9, 'PIEZO');

  test('pin set correctly', function() {
    assert.equal(piezo.pin, 9);
    assert.equal(piezo.mode, 'digital');
    assert.equal(piezo.direction, 'output');
    assert.equal(piezo.special, 'piezo');
  });

  test('pin set correctly with constant', function() {
    var cpiezo = b.pin(9, b.PIEZO);
    assert.equal(cpiezo.pin, 9);
    assert.equal(cpiezo.mode, 'digital');
    assert.equal(cpiezo.direction, 'output');
    assert.equal(cpiezo.special, 'piezo');
  });

  test('methods are defined', function() {
    assert.isFunction(piezo.read);
    assert.isFunction(piezo.write);
    assert.isFunction(piezo.tone);
    assert.isFunction(piezo.noTone);
    assert.isFunction(piezo.threshold);
  });

  test('read callback is set', function() {
    var testcb = function(data) {
      console.log('read cb', data);
    };

    piezo.read(testcb);
    assert.equal(piezo.readcb, testcb);
    assert.isDefined(piezo.val);

  });

  test('threshold sets threshold val and overThreshold method', function() {
    piezo.threshold(200);
    assert.isFunction(piezo.overThreshold);
    assert.equal(piezo.threshold, 200);
  });

});

suite('Knock', function() {
  var knock = b.pin(9, 'KNOCK');

  test('pin set correctly', function() {
    assert.equal(knock.pin, 9);
    assert.equal(knock.mode, 'digital');
    assert.equal(knock.direction, 'output');
    assert.equal(knock.special, 'knock');
  });

  test('pin set correctly with constant', function() {
    var cknock = b.pin(9, b.KOCK);
    assert.equal(cknock.pin, 9);
    assert.equal(cknock.mode, 'digital');
    assert.equal(cknock.direction, 'output');
    assert.equal(cknock.special, 'knock');
  });

  test('methods are defined', function() {
      assert.isFunction(knock.read);
      assert.isFunction(knock.write);
      assert.isFunction(knock.tone);
      assert.isFunction(knock.noTone);
      assert.isFunction(knock.threshold);
    });

  test('threshold sets threshold val and overThreshold method', function() {
    knock.threshold(200);
    assert.isFunction(knock.overThreshold);
    assert.equal(knock.threshold, 200);
  });

});

suite('Tone', function() {
  var tone = b.pin(9, 'TONE');

  test('pin set correctly', function() {
    assert.equal(tone.pin, 9);
    assert.equal(tone.mode, 'digital');
    assert.equal(tone.direction, 'output');
    assert.equal(tone.special, 'tone');
  });

  test('pin set correctly with constant', function() {
    var ctone = b.pin(9, b.TONE);
    assert.equal(ctone.pin, 9);
    assert.equal(ctone.mode, 'digital');
    assert.equal(ctone.direction, 'output');
    assert.equal(ctone.special, 'tone');
  });

  test('methods are defined', function() {
      assert.isFunction(tone.read);
      assert.isFunction(tone.write);
      assert.isFunction(tone.tone);
      assert.isFunction(tone.noTone);
      assert.isFunction(tone.threshold);
    });

  test('threshold sets threshold val and overThreshold method', function() {
    tone.threshold(200);
    assert.isFunction(tone.overThreshold);
    assert.equal(tone.threshold, 200);
  });

});