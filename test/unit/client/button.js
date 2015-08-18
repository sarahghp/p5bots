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

    button.pressed(pressedCb);
    assert.equal(pressedCb, button.buttonPressedcb);
  });

  test('held set correctly', function() {
    var heldCb = function(){
      console.log('Button was held');
    };

    var setCb = function() {
      var timeout = setTimeout(cb, threshold);
      return timeout;
    };

    button.held(heldCb, 3000);
    assert.equal(setCb, button.buttonHeldcb);
  });

  test('released set correctly', function() {
    var releasedCb = function(){
      console.log('Button was released');
    };

    button.released(releasedCb);
    assert.equal(releasedCb, button.buttonReleasedcb);
  });

});