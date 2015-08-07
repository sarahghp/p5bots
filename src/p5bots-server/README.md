# p5bots-server

These are the files necessary for the server end of the p5bots setup. While the instructions below help you get the example file up and running, you'll need the [client-side library](https://github.com/sarahgp/p5bots) as well to make your own work with the p5 and p5bots APIs.

_Note: This is still version 0.0.x, so there are a lot of todos left. Anything can happen._

## Setup

### Arduino
1. Download [Arduino IDE](https://www.arduino.cc/en/main/software).
2. Upload `File > Examples > Firmata > StandardFirmata to your board`. To do this, you'll have to select your board and serial port from the Tools menu. ([More instructions from Arduino.](https://www.arduino.cc/en/Guide/MacOSX)) If you are only using serial, you can skip this step.
3. Write down the port your board is using; you may need it later.

### Javascript
1. Install node & npm if you haven't already; be sure you have node 0.12.x+ and npm 2.0.x+. Installing and updating node with [homebrew](http://blog.teamtreehouse.com/install-node-js-npm-mac) is probably the easiest approach. You can [update npm using npm](https://docs.npmjs.com/getting-started/installing-node).
2. Install p5bots server. It's easier to use if you do it globally: 
```
npm install -g p5bots-server
```

but if you don't have root access to your computer or just wanna keep things local, that's chill, too:

```
npm install p5bots-server
```

## Run Examples

To test your setup, you can run any of the examples in `examples/quicktest.js`. (It's inside the `/usr/local/lib/node_modules/p5bots-server` folder.)

Currently, the RGB LED test is uncommented. To run it, set up the breadboard like this:

![rgb led layout with red in 9, green in 10, and blue in 11, plus resistors between board and leg; ground is to ground/](img/rgb_led.png)

_This setup uses a common-anode RGB led. The pin with the longest leg is the anode, and should go into the hole connected to ground. Red is pin 9, green 10, blue 11._

If you installed globally, run:

```js
bots-go -d 'node_modules/p5bots-server/example'
```

If you installed locally, you can run:

```
node ./node_modules/.bin/bots-go -d './node_modules/p5bots-server/example'
```

or navigate to `node_modules/p5bots-server` and run:

```
npm run examples-go
```

Open your browser to `localhost:8000` and you should see a circle whose color is also displayed on your RGB Led. Try pressing the arrow keys.

For other examples, checkout `p5bots-server/example/quicktest.js` and try other layouts. From the `/p5bots-server` folder, you can run `npm run examples-go` to get the server up.

## Common Errors
If you get an error telling you the board cannot be found, or something like:

```js
Error: Error: Cannot open /dev/cu.usbmodem1421
```

you may have to adjust [the board declaration in `quicktest.js`](https://github.com/sarahgp/p5bots/blob/master/src/p5bots-server/example/quicktest.js#L53).

Either use the port you noted down in setup, assuming you haven't moved the board, or check out the console, where we are listing the ports via the serial command. The one that looks like `/dev/cu.*` is likely the one you need.

If when installing the package you get something like:
```
npm ERR!   errno: 3,
npm ERR!   code: 'EACCES',
npm ERR!   path: '/usr/local/lib/node_modules/p5bots-server',
npm ERR!   fstream_type: 'Directory',
npm ERR!   fstream_path: '/usr/local/lib/node_modules/p5bots-server',
npm ERR!   fstream_class: 'DirWriter',
npm ERR!   fstream_stack:
npm ERR!    [
'/usr/local/lib/node_modules/npm/node_modules/fstream/lib/dir-writer.js:36:23',
npm ERR!
'/usr/local/lib/node_modules/npm/node_modules/mkdirp/index.js:37:53',
npm ERR!      'Object.oncomplete (fs.js:107:15)' ] }
npm ERR!
npm ERR! Please try running this command again as root/Administrator.
```
you may have to install using 

```
sudo install -g p5bots-server
```

or else install locally.

## Command Line Options

`bots-go` can be run with the following options:

```
-d, --dir <d>        Set base directory for server
-f, --file <f>       Set file to use for the index page
-p, --ufilepath <p>  Path to file containing user-defined server-side listeners.
-n, --ufilename <n>  Path, inluding file name, to user-defined server-side listeners.
```

You can also find these by running

```js
node ./app.js -h
```
in the `p5bots-server` directory.