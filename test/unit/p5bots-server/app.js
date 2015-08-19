// The file we're testing
var app = require('../../../src/p5bots-server/app.js');

// Actual tests
suite('CLI & server inputs', function(){

  test('program is defined', function() {
    assert.isDefined(app.program);
  });

  test('directory is defined', function() {
    assert.isDefined(app.directory);
  });

  test('index is defined', function() {
    assert.isDefined(app.index);
  });
});