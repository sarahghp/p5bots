# Hello, World!

Hello World is the traditional first program to be written when one is beginning a new language. In software, this means printing the string "Hello, World". In hardware, this means blinking an LED. Since p5.bots bridges the line, we'll do both!

**Note:** This tutorial assumes you are working on a Mac, have administrator rights on your machine.

### Prerequisites
1. Node 0.12.x+
2. NPM 2.0.x+
3. Arduino Uno
4. 1 LED
5. 220 Ohm resistor
6. Breadboard, wire

If you need help with node or NPM, check out [the guide at Treehouse](http://blog.teamtreehouse.com/install-node-js-npm-mac).

### Get Your Arduino Ready
To use p5.bots, our Arduino needs to have the Standard Firmata sketch uploaded to it. This sketch tells our Arduino how to interpret the commands p5bots sends.

1. Download the [Arduino IDE](https://www.arduino.cc/en/main/software).
2. Upload `File > Examples > Firmata > StandardFirmata` to your board. To do this, you'll have to select your board and serial port from the `Tools` menu. ([More instructions from Arduino.](https://www.arduino.cc/en/Guide/MacOSX))
3. Write down the port your board is using; you may need it later.

### Get p5bots Server
1. Open Terminal.
2. Install p5bots-server by running: `npm install -g p5bots-server`

### Get p5.js and p5.bots 
1. [Download `p5.js`.](https://github.com/processing/p5.js/releases/download/0.4.8/p5.zip)
2. [Download `p5.bots`.](https://raw.githubusercontent.com/sarahgp/p5bots/master/lib/p5bots.js)

### Get Our Folders Ready
Next, we need to create a place to put our project.

1. Create a new folder for the project: `helloWorld`.
2. Add two files in this folder: `index.html` and `sketch.js`.
3. Inside `helloWorld` create another folder called `scripts`. Move the copies of `p5.js` and `p5.bots.js` into it.

### Let's Code!
Now that we have all the parts we need, we can start writing our code. Let's open `index.html` and add in the boilerplate we need for all HTML files.

```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>HELLO!</title>
  </head>
  <body>
    
  </body>
  </html>
```

Then we need to tell this file about all the screipt files we need: `p5.js` and `p5.bots.js`, plus a pointer to the socket.io CDN. Socket.io is how we send messages between the two parts of p5.bots. A CDN is location on the internet where this is kept. Since so many people use it, it can make more sense to point people to this one instead of having our own copy.

We will also tell it about our sketch file.

```html
<body>
  <script src="https://cdn.socket.io/socket.io-1.3.5.js"></script>
  <script src="scripts/p5.min.js"></script>
  <script src="scripts/p5bots.js"></script>
  <script src="sketch.js"></script>
</body>
```
That's all the code we need in `index.html`. The rest will be in `sketch.js`. Let's open that and add the first Javascript: the p5 `setup` and function:

```js
  function setup(){

  }
```

We will want tell p5 about the board and the board about p5. We should also mention that we will be creating an LED pin. Let's put these before setup, since both functions need to know about them. You will want the first argument, where it says `'/dev/cu.usbmodem1421'` to match the port you write down in the Arduino setup.

```js
var b = p5.board('/dev/cu.usbmodem1421', 'arduino');
var led;

function setup(){

}
```

The LED will be controlled by sending electricity through a pin to our hardware setup. (We'll do that next.) We can declare the pin in setup, noting that it will be plugged into pin 9 and will be an LED.

```js
function setup(){
  led = b.pin(9, 'LED');
}
``` 

Finally, once the sketch is running, we will use key presses to the arrow keys to trigger functionality. To do so, we will use [p5's `keyPressed()` method]().

```js
function keyPressed() {
  if (keyCode === LEFT_ARROW){
    led.on();
  } else if (keyCode === RIGHT_ARROW) {
    led.off();
  } else if (keyCode === UP_ARROW){
    led.blink();
  } else if (keyCode === DOWN_ARROW) {
    led.noBlink();
  }
}
```

Let's also be sure it says "Hello, Wold!" when we call `led.blink`.

```js
function keyPressed() {
  if (keyCode === LEFT_ARROW){
    led.on();
  } else if (keyCode === RIGHT_ARROW) {
    led.off();
  } else if (keyCode === UP_ARROW){
    led.blink();
    console.log('Hello, World!'); // <- here!
  } else if (keyCode === DOWN_ARROW) {
    led.noBlink();
  }
}
```

Bam! That's all the Javascript. Your complete file should look like this:

```js
var b = p5.board('/dev/cu.usbmodem1421', 'arduino');
var led;

function setup() {
  led = b.pin(9, 'LED');
}

function keyPressed() {
  if (keyCode === LEFT_ARROW){
    led.on();
  } else if (keyCode === RIGHT_ARROW) {
    led.off();
  } else if (keyCode === UP_ARROW){
    led.blink();
    console.log('Hello, World!'); 
  } else if (keyCode === DOWN_ARROW) {
    led.noBlink();
  }
}
```

### Set Up the Board
Whew! We're halfway there. Now we can put the computer aside for a moment and build our circuit:

![led diagram](diagrams/led.png)

The short leg of the LED will be wired to GND, ground. Wires going to ground are often indicated with black wires on diagrams.

The other leg will be connected to a resistor (they will be plugged in to the same row). The resistor protects the LED from getting too much power at once.

Finally, the LED will be connected to pin 9 on the Arduino board. Becuase we will send information over this wire, it is yellow. In this case, the information is just a signal as to whether to let power run into the circuit or not.

You can test that your setup is working by plugging the Arduino into the computer and taking the wire that is in pin 9 and putting it into 3.3V. If the LED lights, the citcuit is okay. Now, move the wire back to 9 and keep the Arduino plugged in.

### Start the Server
Now we need to open the gates and let the two talk. 

1. Return to the Terminal. Be sure you are in `helloWorld`.
2. Type `bots-go -f`, then drag the `index.html` file into the terminal window. You should end up with something like this:

```bash
bots-go -f /Users/computer/sites/p5bots/helloWord/index.html
```

Hit enter and you should something like this:

```bash
server starting
```

### Hello, World!
Yay! Everything is running. Open a web browser to `localhost:8000`. Hit the left arrow to turn the LED on; right to turn it off. Hit up and get it blinking.

Now open the console, probably by hitting: `command+option+I`. There should be note for you in the log: the LED is saying hello!