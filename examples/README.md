# Welcome to the Examples!

This section contains example implementations for each of the standard and special modes:
  -[Basics](#basics)  
  -[LEDs](#leds)  
  -[RGB LEDs](#rgb-leds)  
  -[Motor & Servo](#motor--servo)  
  -[Button](#button)  
  -[Variable Resistors](#variable-resistors)  
  -[Temperature](#temperature)  
  -[Piezo: Tone & Knock](#piezo--tone--knock)  
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


#### Analog Read
![simple button diagram](diagrams/simple_button.png)


#### Button Draw
![simple button diagram](diagrams/simple_button.png)


#### Light LED (Digital Write)
![led diagram](diagrams/led.png)


#### PWM Slider (PWM)
![led diagram](diagrams/led.png)




### LEDs
### RGB LEDs
### Motor & Servo
### Button
### Variable Resistors
### Temperature
### Piezo: Tone & Knock
### Serial