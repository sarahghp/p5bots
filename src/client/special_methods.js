define(function (require) {
  
  var special = {
    
    button: require('src/client/button'),

    led: require('src/client/led'),

    motor: require('src/client/motor'),

    rgbled: require('src/client/rgb'),

    serial: require('src/client/serial'),

    servo: require('src/client/servo'),

    vres: require('src/client/variable_resistor')

  };

  return special;


});