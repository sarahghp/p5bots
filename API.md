# p5.bots

p5.bots is a library to facilitate communication between [p5.js](http://p5js.org/) running in your browser and a microcontroller* running [Firmata](https://github.com/firmata/arduino)**.

<small>
```
* The library has been tested on Arduino Unos, but should work on anything running Firmata.  
** The serial API does not depend on Firmata.
```
</small>

## Setting Up

There are two steps to get up and running with p5.bots.

### Bots in the Browser: The Client
In addition to including p5.js in your html file, you will need two other scripts to get p5.bots going: a link to `socket.io`'s CDN or to a version you can download at [socket.io](http://socket.io/download/) and a pointer to the `p5bots.js` file from the [lib directory](https://github.com/sarahgp/p5bots/tree/master/lib).

```html
<script src="https://cdn.socket.io/socket.io-1.3.5.js"></script>
<script src="/p5_scripts/p5bots.js"></script>
```


### But Wait, There's More: Server-Side Files
To send messages from the client to the board, you also need to run the p5.bots server files. For more detail on setting up the server and making sure it's working check out the README at [p5bots-server in src](https://github.com/sarahgp/p5bots/tree/master/src/p5bots-server) & download [p5bots-server from NPM](https://www.npmjs.com/package/p5bots-server).

## Using the API

Below is a short annotated guide to the API. Detailed examples & tutorials by the end of August.

### Base Functions

#### Initialize Board
```js
// returns a reference to the board object
p5.board(port, type)
```

-- TYPE: string, probably 'arduino'  
-- PORT: string, see [p5bots-server README](https://github.com/sarahgp/p5bots/tree/master/src/p5bots-server) for figuring out what this should be

#### Initialize Pin
```js
// returns a reference to the pin object
board.pin(num, type, direction) 
```
-- NUM: pin #  
-- TYPE: digital | analog | pwm || any special method
-- DIRECTION: input | output  
  
```js
// shorthand pin initialization
pin = board.pin(num) 
```
-- default to digital output

#### Basic Pin Methods
```js
// each time a value changes pin.val will be updated + optional callback function will be called 
pin.read([callback fn]) 

// send a value to the pin
pin.write(val) 
```

### Special write methods

#### LED Methods
```js
// initialize the pin
led = board.pin(num, 'LED')

// basic functions work as on any other pin
led.write()
led.read()

// write high or low
led.on()
led.off()

// starts the blinking, duration indication how long it stays on/off
led.blink(duration)

// stops the blinking, funnily enough
led.noBlink()

// fades the pin from the start to stop brightness
// brightness is pwm, 0 to 255; time is in ms
// default total is 3000, interval is 200
led.fade([start, stop, [, total time, interval]])
```

#### RGB LED Methods
```js
// initialize with hash of led options
rgb = board.pin({ r: int, g: int, b: int, common: 'anode' || 'cathode' }, 'RGBLED');

// sets color, takes a p5 color obj or array of values
rgb.write() 
rgb.read()

// Turns led to previously given color or white
rgb.on()

// Writes low but retains previous color
rgb.off()

// starts the blinking, duration indication how long it stays on/off
rgb.blink(duration)

// stops the blinking, funnily enough
rgb.noBlink()

// fades the pin from the start to stop brightness
// brightness is pwm, 0 to 255; time is in ms
// default total is 3000, interval is 200
// each pin is specified separately
rgb.fade([start, stop, [, total time, interval]] * 3)
```

#### MOTOR Methods
```js
// initialize the pin
motor = board.pin(num, 'LED')

// set motor to highest speed, lowest speed
motor.start()
motor.stop()

// set motor to a given speed, pwm 0 to 255
motor.write(int)
```

#### SERVO Methods
```js
// initialize the pin
servo = board.pin(num, 'SERVO')

// range in degrees, default is 0 to 180
servo.range([int, int])

// set to specific position, in degrees
servo.write(int)

// servo moves back and forth, across range; stops
servo.sweep()
servo.noSweep()
```

### Special read methods

#### BUTTON Methods
```js
// initialize the pin
button = board.pin(num, 'BUTTON')

// each method takes a callback to be called when the button is pressed or released
button.pressed(cb)
button.released(cb)

// hold also requires a threshold to trigger
button.held(cb, int)
```

#### Variable Resistor

These methods can be used with any variable resistor: for instance, a potentiometer, photo- or touch-sensitive sensor.

```js
// initialize the pin
vr = board.pin(num, 'VRES')

// sets the range of values for methods to work with, defaults to 0 to 1023
vr.range([int, int]) 

// works like standard read function: sets vr.val and calls callback on each value change
vr.read([cb])

// sets threshold value
vr.threshold(int)

// once a threshold has been set, this returns boolean (true or false) 
vr.overThreshold 
```

#### TEMP Methods
Initial implementation is for sensors that read voltage change for temperature

```js
// initialize the pin with number and voltage
temp = board.pin({pin: num, voltsIn: 5})

// will return raw value always, if you want it to return in a different mode 
// you can call temp.read( function(val) { console.log(temp.f(val)) } );
temp.read() 

// return temp in given system
temp.C
temp.F
temp.K
```

#### PIEZO Methods
The piezo can be used as an output pin, to emit a tone or as an input pin, a knock sensor.

*Tone functions: Output*
```js
// initialize the pin
t = board.pin(num, 'TONE') || board.pin(num, 'PIEZO')

// sends a single value
t.write()

// sennds a note or a frequency for the given duration
t.tone(note || freq, duration)
t.noTone()
```

*Knock functions: Input* 
```js
// initialize the pin
k = board.pin(num, 'KNOCK') || board.pin(num, 'PIEZO')

// standard read function
k.read()

// sets threshold value
k.threshold()

// once a threshold has been set, this returns boolean (true or false) 
k.overThreshold // returns boolean
```

### Other Special Methods
#### Serial

In addition to the Firmata-based methods above, p5 has a loose [`node-serialport`](https://www.npmjs.com/package/serialport) wrapper.

```js
// Access with
serial = p5.serial()

// To get a list of ports on your machine, you can use list(). 
// Serial does not have to be connected to get a list of ports
serial.list()

// Otherwise you must first connect
// Config object takes options listed at: https://github.com/voodootikigod/node-serialport#serialport-path-options-openimmediately-callback

serial.connect(path [, { config obj } ]) 

// Basic read and write events
serial.read()
serial.write()
```


### Create Your Own Methods

If you are familiar with node, you can write your own server-side listeners to call from the client. To do so:

1. Set up a server file where each function you would like to access is its property on the exports object. Each function has access to the socket and the Firmata board instance.

```js

exports.mine = function mine(board, socket) {
  socket.on('event', function(data){ .. });
  socket.emit('another', { name: 'data-object' });
}

```

2. Tell the server about this file when you start using one of the following options. 

```
-p, --ufilepath <p>  Path to file containing user-defined server-side listeners.
-n, --ufilename <n>  Path, inluding file name, to user-defined server-side listeners.
```

Path defaults to the current directory and filename to `user.js`.


## Contributing
If you are interested in contributing please start by reading [CONTRIBUTING.md]

## License
[LGPL](license.txt)