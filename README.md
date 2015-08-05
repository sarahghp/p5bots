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
pins will take a hash 

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


## Contributing
This is still in alpha, but if you want to report issues, please do so! If you feel like getting your hands dirtier and adding features, please add an issue describing your plan and then fork away! Exclamation point!