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
    assert.equal(createdBoard.type, basicBoard.type);
    assert.equal(createdBoard.port, basicBoard.port);
  });

  test('can add a pin', function(){
    createdPin = p5.pin(9, 'DIGITAL', 'OUTPUT');
    assert.deepEqual(createdPin, pinnedBoard);
  });
});