var basicBoard = {
      type: 'arduino',
      port: '/dev/cu.usbmodem1421'
    },
    pinnedBoard = {
      pin: 9,
      mode: 'DIGITAL',
      direction: 'OUTPUT'
    },
    createdBoard, createdPin;

suite('p5sensors basic', function(){
  test('can create a board object', function(){
    createdBoard = p5.board('/dev/cu.usbmodem1421', 'arduino');
    assert.deepEqual(createdBoard, basicBoard);
  });

  test('can add a pin', function(){
    createdPin = p5.pin(9, 'DIGITAL', 'OUTPUT');
    assert.deepEqual(createdPin, pinnedBoard);
  });
});