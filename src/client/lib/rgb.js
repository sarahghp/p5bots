var utils = require('./socket_utils.js');

/**
 * Processes & adds rgb led–specific methods to pin object. Called via special.
 * Does not use standard read and write constructors.
 *
 * @param  {Object} pin
 * @return {Object} mutated pin
 */
function rgb(pin) {
  // Unpack pin object & initialize pins
  var settings = pin.pin;

  pin.redPin = settings.r || settings.red;
  pin.greenPin = settings.g || settings.green;
  pin.bluePin = settings.b || settings.blue;
  pin.common = settings.common || settings.c || 'cathode';

  utils.dispatch(utils.pinInit(pin.redPin, pin.mode, pin.direction));
  utils.dispatch(utils.pinInit(pin.greenPin, pin.mode, pin.direction));
  utils.dispatch(utils.pinInit(pin.bluePin, pin.mode, pin.direction));

  /**
   * Unlike other writes, which take a Number or a constant,
   * the RGB LED takes a p5.Color object or an array of
   * three values as an argument. This is also where inversion for
   * anode RGBs is handled.
   *
   * @param  {Object | Array} color p5.Color object or an array of RGB values
   *
   */
  pin.write = function(color) {

    this.color = Array.isArray(color) ?  p5.prototype.color(color) : color;

    let red = p5.prototype.red(this.color),
        green = p5.prototype.green(this.color),
        blue = p5.prototype.blue(this.color);

    // Invert values for common anode RGBs
    if (this.common === 'anode') {
      red = 255 - red;
      green = 255 - green;
      blue = 255 - blue;
    }

    function rgbWrite() {
      utils.socket.emit('rgb write', {
        red: [this.redPin, red],
        green: [this.greenPin, green],
        blue: [this.bluePin, blue]
      });
    }

    utils.dispatch(rgbWrite.bind(this));

  };

  /**
   * The RGB read reassmbles values returned from each pin into a
   * p5.Color object and then sets both the pin.val property and the
   * pin.color, in addition to calling the user-provided callback
   * with said value
   *
   * @param  {Function} [arg] User-provided callback function
   *
   */
  pin.read = function(arg) {
    this.incomingColor = {};

    function rgbRead() {
      if (arg) { this.readcb = arg; }

      utils.socket.emit('rgb read', {
        pins: { red: this.redPin, green: this.greenPin, blue:this.bluePin },
        arg: arg
      });

      /**
       * This method handles the async reasembly by populating the incoming
       * color property with socket-received values and then triggering cb
       * when complete
       *
       * @param {Object} data Single-pin info returned by pin read on server
       */
      function setRGBvals(data){
        this.incomingColor[data.type] = data.val;

        if (Object.keys(this.incomingColor).length === 3) {
          this.color = p5.prototype.color([
            this.incomingColor.red,
            this.incomingColor.green,
            this.incomingColor.blue]);
          this.readcb(this.color);
        }
      }

      utils.socket.on('rgb return red', setRGBvals.bind(this));
      utils.socket.on('rgb return green', setRGBvals.bind(this));
      utils.socket.on('rgb return blue', setRGBvals.bind(this));
    }

    utils.dispatch(rgbRead.bind(this));

  };

  // Reverse high/low values for common anode LEDs
  var zero = pin.common === 'anode' ? 255 : 0,
      top  = pin.common === 'anode' ? 0 : 255;

  pin.on = function() {

    function rgbOn() {
      utils.socket.emit('rgb blink cancel');
      var setTo = this.offSaved || this.color.writeArr || [top, top, top];
      this.write(setTo);
    }

    utils.dispatch(rgbOn.bind(this));

  };

  pin.off = function() {
    this.offSaved = this.color.writeArr.slice();

    function rgbOff() {
      utils.socket.emit('rgb blink cancel');
      this.write([zero, zero, zero]);
    }

    utils.dispatch(rgbOff.bind(this));

  };


  pin.blink = function() {
    function rgbBlink() {
      utils.socket.emit('rgb blink', {
        pins: {
          red: [this.redPin, this.color.writeArr[0] || 255],
          green: [this.greenPin, this.color.writeArr[1] || 255],
          blue: [this.bluePin, this.color.writeArr[2] || 255]
        },
        length: length
      });
    }

    utils.dispatch(rgbBlink.bind(this));
  };

  pin.noBlink = function() {

    function rgbNoBlink() {
      utils.socket.emit('rgb blink cancel');
    }

    utils.dispatch(rgbNoBlink);

  };

  /**
   * Unpacks fade ararys to send to server, where the math happens :D
   *
   * @param  {Array} red   The 2 required & 2 optional vals, all Numbers:
   *                       start, stop, total run time, increment time,
   *                       the latter two in ms
   * @param  {Arary} green The 2 required & 2 optional vals, all Numbers:
   *                       start, stop, total run time, increment time,
   *                       the latter two in ms
   * @param  {Arary} blue  The 2 required & 2 optional vals, all Numbers:
   *                       start, stop, total run time, increment time,
   *                       the latter two in ms
   *
   */
  pin.fade = function (red, green, blue) {
    function rgbFade() {
      utils.socket.emit('rgb fade', {
        red: {
          pin: this.redPin,
          start: red[0],
          stop: red[1],
          time: red[2] || 3000,
          inc: red[3] || 200
        },
        green: {
          pin: this.greenPin,
          start: green[0],
          stop: green[1],
          time: green[2] || 3000,
          inc: green[3] || 200
        },
        blue: {
          pin: this.bluePin,
          start: blue[0],
          stop: blue[1],
          time: blue[2] || 3000,
          inc: blue[3] || 200
        }
      });
    }

    utils.dispatch(rgbFade.bind(this));

  };

  return pin;
}

module.exports = rgb;
