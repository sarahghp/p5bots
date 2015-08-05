# p5.bots

p5.bots is a library to facilitate communication between [p5.js](http://p5js.org/) running in your browser and a microcontroller* running [Firmata](https://github.com/firmata/arduino)**.

<small>
* The library has been tested on Arduino Unos, but should work on anything running Firmata.  
** The serial API does not depend on Firmata.
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
```
p5.board(port, type) // returns a reference to the board object
```

-- TYPE: string, probably 'arduino'  
-- PORT: string, see [p5bots-server README](https://github.com/sarahgp/p5bots/tree/master/src/p5bots-server) for figuring out what this should be


## Contributing
This is still in alpha, but if you want to report issues, please do so! If you feel like getting your hands dirtier and adding features, please add an issue describing your plan and then fork away! Exclamation point!