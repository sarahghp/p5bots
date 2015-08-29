# Contributing

Contributing involves two important activities: development and not being a jackass.

## Be Nice
As contributors to a p5.js library, p5bots collaborators are expected to abide by the [p5 Code of Conduct](https://github.com/processing/p5.js/blob/master/CONTRIBUTING.md).

If you feel someone has violated this code or is otherwise making the community an unhappy place to be, please email Sarah at `hi@sarahgp.com`.

## Development

### Claiming a Task
If you'd like to contribute to p5bots developement, check out the [issues](https://github.com/sarahgp/p5bots/issues) or open your own to let us know what you want to work on.

Also, examples are always appreciated. See [the examples repo](examples) for what we already have.

### Prerequisities
1. Node.js
2. Npm
3. Git
4. Grunt
5. A microcontroller running Firmata

### Getting Set Up
1. Clone this repo: `git clone git@github.com:sarahgp/p5bots.git`
2. Enter the directory and install dependencies with `npm install`
3. Run `grunt` to build the files.
4. Start the server with `npm start`, which will serve the `src/p5bots-server/examples/index.html` file on `localhost:8000`.   
4a. To learn how configure the server to run other files, run `node src/p5bots-server/app.js --help`.

### Workflow
In general, the build workflow for this app has been set up to be as similar to the main `p5.js` repo as possible. The [Gruntfile](Gruntfile.js) has been annotated with an outline of the tasks. Running `grunt` from the command line will run them all.

As, the library's primary function is to pass messages between the client and the server, you will see that within the `src/` directory, there are two, mostly-matching files structures. Files on the client side interact with `p5.js` and those on the server with the board, via the [Javascript implementation of Firmata](https://github.com/jgautier/firmata). Both communicate with one another via `socket.io`.

### Testing
Client-side files can be tested with `grunt test`. Additional test files can be added in `test/unit/client` and the path should then be added in `test/test.html` and `test/test-minified.html`.

Server-side integrations can only be tested manually for now, by following the instructions in the [`p5bots-server` README](src/p5bots-server/README.md). But don't worry, [there's an issue for that](https://github.com/sarahgp/p5bots/issues/1).

### Documentation
Documentation is automatically generated from comments using [JSDoc](http://usejsdoc.org/). I recommend installing [DocBlockr](https://github.com/spadgos/sublime-jsdocs) if you use Sublime.

Insufficiently documented PRs will not be accepted. If you are adding functionality, you should also include an example at the very least, in addition to API documentation. If it is complex, a tutorial would go a long way.