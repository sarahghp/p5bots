suite('Button', function() {
  var b = p5.board('/dev/cu.usbmodem1421', 'arduino'),
      button = b.pin(9, 'BUTTON');

  test('pin set correctly', function() {
    assert.equal(button.pin, 9);
    assert.equal(button.mode, 'digital');
    assert.equal(button.direction, 'input');
    assert.equal(button.special, 'button');
  });

  test('pin set correctly with constant', function() {
    var cbutton = b.pin(9, b.BUTTON);
    assert.equal(cbutton.pin, 9);
    assert.equal(cbutton.mode, 'digital');
    assert.equal(cbutton.direction, 'input');
    assert.equal(cbutton.special, 'button');
  });

  test('pressed set correctly', function() {
    var pressedCb = function(){
      console.log('Button was pressed');
    };

    var assertion = function() {
      assert.equal(pressedCb, button.buttonPressedcb);
    };

    button.pressed(pressedCb);
    setTimeout(assertion, 1000);

  });

  test('held set correctly', function() {
    var heldCb = function(){
      console.log('Button was held');
    };

    var setCb = function() {
      var timeout = setTimeout(cb, threshold);
      return timeout;
    };
    var assertion = function() {
      assert.equal(setCb, button.buttonHeldcb);
    };

    button.held(heldCb, 3000);
    setTimeout(assertion, 1000);

  });

  test('released set correctly', function() {
    var releasedCb = function(){
      console.log('Button was released');
    };

    var assertion = function() {
      assert.equal(releasedCb, button.buttonReleasedcb);
    };

    button.released(releasedCb);
    setTimeout(assertion, 1000);

  });

});