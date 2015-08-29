# Welcome to p5bots!

* [How Does This Work?](#how-does-this-work)
* [p5.Serial](#p5serial)
* [p5.Board](#p5board)
* [Getting Started](#getting-started)
* [Issues](#issues)
* [Contributing](#contributing)


## How Does This Work?
p5bots is a library that works to send messages from your browser, where you are running p5.js, to your microcontroller, most likely an Arduino. To do this, it uses the `socket.io` library and `node.js` to send messages between the two devices, in a language each device can understand.

This way, you can click on a sketch to light an LED or use temperature data to drive a sketch — or more.

![diagram of client, server, and microcontroller](img/how-it-works.png)

p5bots comprises two sets of files: the client file, called `p5bots.js`, which is included in the `index.html` along with `p5.js` and your sketch; and the server files, called `p5bots-server`, which can be downloaded from [npm](https://www.npmjs.com/package/p5bots-server).

If all this sounds a little too manual, you can also use p5bots from the [p5.js IDE](https://github.com/processing/p5.js-editor).

## p5.Serial
p5bots has a [`p5.serial` method](API.md#serial) that can be used in combination with an Arduino sketch listening for serial, much in the same way the Processing serial library can.

For more details on this module, see [serial in the API reference](API.md#serial).

If you use serial only, you do not need to install Firmata on your board.

## p5.Board
The majority of p5bots functionality lives within `p5.board`. Inspired by [Johnny-Five](http://johnny-five.io/), p5.board provides a number of hardware-specific methods in addition to plain digital, analog, and pwm read/write methods.

Details for these methods, plus examples can be found in the module pages. Example sketches and hardware diagrams are also available in [the examples directory](examples).

## Getting Started
Ready to go? Good entry points include:
* [the Hello, World tutorial]()
* [checking out examples, say for RGB LEDs](https://github.com/sarahgp/p5bots/tree/master/examples#rgb-leds)
* reading about [the client API](API.md), which lists the methods you can use in your p5 code, and [p5bots-server](https://github.com/sarahgp/p5bots/tree/master/src/p5bots-server)
* or, [heading over to p5.js to learn more about the drawing library](http://p5js.org/)

## Issues
[Report issues in this repo.](https://github.com/sarahgp/p5bots/issues)

## Contributing
Want to fix an issue you've identified? Looking to create some functionality we have yet to add? Check out the [p5bots repo on Github](https://github.com/sarahgp/p5bots) and, particularly, [CONTRIBUTING.md](https://github.com/sarahgp/p5bots/blob/master/CONTRIBUTING.md).

## License
[LGPL](license.txt)