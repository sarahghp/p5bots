# Welcome to the Examples!

This section contains example implementations for each of the standard and special modes:

  -[Basics](#basics)  
  -[LEDs](#leds)  
  -[RGB LEDs](#rgb-leds)  
  -[Motor & Servo](#motor--servo)  
  -[Button](#button)  
  -[Variable Resistors](#variable-resistors)  
  -[Temperature](#temperature)  
  -[Piezo: Tone & Knock](#piezo-tone--knock)  
  -[Serial](#serial)  

Script files for each of these examples are available in (`example_scripts`)(example_scripts). You can determine which is run by editing [this line](https://github.com/sarahgp/p5bots/blob/master/examples/index.html#L13) to point to the script you want to run:

```html
   <!-- Swap out the script below with any of the others in example_scripts. -->
   <script src="/example_scripts/01_basics/03_ButtonDraw.js"></script>
```

Or peruse the examples below and morph them to make your own!

### Finding Your Port

The examples may fail if your port has a different name than the default port: `/dev/cu.usbmodem1421`, aka the left-side USB port on a MacBook Air.

Common ports include:

```js
/dev/cu.usbmodem1421 // MacBook Air, left side
/dev/cu.usbmodem1411 // MacBook Air, right side; MacBook, left side
/dev/cu.usbmodem1451 // MacBook, right side
```

If your computer is not on this list — or if these fail — you can find your port by opening the Arduino IDE and finding the port under `Tools > Port` or by running the following in your Terminal with the Arduino plugged in:

```bash
 ls /dev/tty.*
```

## Examples

### Basics

#### Digital Read
![simple button diagram](diagrams/simple_button.png)  
_diagram: simple_button_

```js
// Board setup — you may need to change the port
var b = p5.board('/dev/cu.usbmodem1421', 'arduino');

// Test digital read
var p = b.pin(9, 'DIGITAL', 'INPUT');
p.read(function(val){console.log(val);});

function setup() {

  var innerStr = '<p style="font-family:Arial;font-size:12px">'
  innerStr += 'Check out the console for readings</p>';

  createDiv(innerStr);
}
```


#### Analog Read
![simple button diagram](diagrams/simple_button.png)  
_diagram: potentiometer_

```js
// Board setup — you may need to change the port
var b = p5.board('/dev/cu.usbmodem1421', 'arduino');

// Test analog read
var p = b.pin(0, 'ANALOG', 'INPUT');
p.read(function(val){console.log(val);});

function setup() {
  createCanvas(300, 200);

  var innerStr = '<p style="font-family:Arial;font-size:12px">'
  innerStr += 'Check out the console for readings</p>';

  createDiv(innerStr);
}
```


#### Button Draw
![simple button diagram](diagrams/simple_button.png)  
_diagram: simple_button_

```js
// Board setup — you may need to change the port
var b = p5.board('/dev/cu.usbmodem1421', 'arduino');

// Draw ellipses with a button

var p;

function setup() {
  p = b.pin(9, 'DIGITAL', 'INPUT');
  p.read();

  createCanvas(1200, 300);
  noStroke();

  var innerStr = '<p style="font-family:Arial;font-size:12px">'
  innerStr += 'Press the button</p>';

  createDiv(innerStr);
}

function draw() {
  if (p.val) {
    fill(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    ellipse(Math.random() * width, Math.random() * height, 60, 60);
  }
}
```


#### Light LED (Digital Write)
![led diagram](diagrams/led.png)  
_diagram: led_

```js
// Board setup — you may need to change the port
var b = p5.board('/dev/cu.usbmodem1421', 'arduino');

// Click the circle to light the LED
 
var pin;

function setup() {
  createCanvas(400, 400);
  noStroke();
  fill(62, 0, 255);
  ellipse(width/2, height/2, 100, 100);
  pin = b.pin(9, 'DIGITAL', 'OUTPUT');
}

function mousePressed() {
  var d = dist(width/2, height/2, mouseX, mouseY);
  if (d < 100) {
    pin.write('HIGH');
  }
}

function mouseReleased() {
  pin.write('LOW');
}
```

Alternately, integrated with p5.DOM element.

```js
// Board setup — you may need to change the port
var b = p5.board('/dev/cu.usbmodem1421', 'arduino');

// Click a button to light the LED

function setup() {
  createCanvas(400, 400);
  var pin = b.pin(9, 'DIGITAL', 'OUTPUT');

  
  var button = createButton('LIGHT THE LED!!');
  button.position(width/2, height/2);
  button.mousePressed(function(){
    pin.write('HIGH');
  });

  button.mouseReleased(function(){
    pin.write('LOW');
  });
}
```


#### PWM Slider (PWM)
![led diagram](diagrams/led.png)  
_diagram: led_

```js
// Board setup — you may need to change the port
var b = p5.board('/dev/cu.usbmodem1421', 'arduino');

// PWM Slider

var slider, pin;

function setup() {
  slider = createSlider(0, 255, 150);
  slider.position = (10, 10);
  pin = b.pin(9, 'PWM', 'OUTPUT');

}

function draw() {
  var val = slider.value();
  pin.write(val);
}
```




### LEDs
### RGB LEDs
### Motor & Servo
### Button
### Variable Resistors
### Temperature
### Piezo: Tone & Knock
### Serial