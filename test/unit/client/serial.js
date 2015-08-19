suite('Serial', function() {
  var serial = p5.serial();

  test('methods are defined', function() {
    assert.isFunction(serial.connect);
    assert.isFunction(serial.read);
    assert.isFunction(serial.readData);
    assert.isFunction(serial.readEvent);
    assert.isFunction(serial.write);
    assert.isFunction(serial.list);
  });

});