/**
 *  This is the Gruntfile for p5bots.
 *  It is a modified version of the Gruntfile for p5.js. Grunt is a task 
 *  runner/builder, used to build the source code into the library
 *  and handle other housekeeping tasks.
 *
 *  There are four main tasks:
 *
 *  grunt       - This is the default task, which both tests and builds.
 *
 *  grunt build - This task builds and minifies the client source code.
 *
 *  grunt test  - This only runs the automated tests, which is faster than
 *                rebuilding entirely from source because it skips minification
 *                and concatination. If you need to debug
 *                a test suite in a browser, `grunt test --keepalive` will
 *                start the connect server and leave it running; the tests
 *                can then be opened at localhost:9001/test/test.htmln
 *
 *  grunt watch:main  - This watches the source for changes and rebuilds on
 *                      every file change.
 */


module.exports = function(grunt) {

  // Specify what reporter we'd like to use for Mocha
  var reporter = 'Nyan';

  // For the static server used in running tests, configure the keepalive.
  // (might not be useful at all.)
  var keepalive = false;
  if (grunt.option('keepalive')) {
    keepalive = true;
  }


  grunt.initConfig({

    // read in the package, used for knowing the current version, et al.
    pkg: grunt.file.readJSON('package.json'),

    // Configure style consistency checking for this file, the source, and the tests.
    jscs: {
      options: {
        config: '.jscsrc',
        reporter: require('jscs-stylish').path
      },
      build: {
        src: ['Gruntfile.js']
      },
      source: {
        src: [
          'src/**/*.js',
          '!src/external/**/*.js'
        ]
      },
      test: {
        src: ['test/unit/**/*.js']
      }
    },

    // Configure hinting for this file, the source, and the tests.
    jshint: {
      build: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['Gruntfile.js']
      },
      source: {
        options: {
          jshintrc: 'src/.jshintrc',
          ignores: [ 'src/external/**/*.js' ]
        },
        src: ['src/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/unit/**/*.js']
      }
    },

    // Set up the watch task, used for live-reloading during development.
    watch: {
      // Watch the codebase for changes
      main: {
        files: ['src/**/*.js'],
        tasks: ['newer:jshint:source','test'],
        options: {
          livereload: true
        }
      }
    },

    // Set up the mocha task, used for the automated browser-side tests.
    mocha: {
      test: {
        src: ['test/**/*.html'],
        options: {
          urls: [
            'http://localhost:9001/test/test.html',
            'http://localhost:9001/test/test-minified.html'
          ],
          reporter: reporter,
          run: true,
          log: true,
          logErrors: true
        }
      },
    },

    // Set up the mocha-chai-sinon task, used for the automated server-side tests.
    'mocha-chai-sinon': {
      build: {
        src: ['test/unit/server/app.js'],
        options: {
          ui: 'tdd',
          reporter: reporter
        }
      }
    },

    // Build p5bots client source into a single, UMD-wrapped file
    browserify: {
      p5: {
        options: {
          transform: ['brfs'],
          browserifyOptions: {
            standalone: 'p5bots'
          },
          banner: '/*! p5bots.js v<%= pkg.version %> <%= grunt.template.today("mmmm dd, yyyy") %> */'
        },
        src: 'src/client/app.js',
        dest: 'lib/p5bots.js'
      }
    },

    // This minifies the javascript into a single file and adds a banner to the
    // front of the file.
    uglify: {
      options: {
        banner: '/*! p5bots.js v<%= pkg.version %> <%= grunt.template.today("mmmm dd, yyyy") %> */ '
      },
      build: {
        src: 'lib/p5bots.js',
        dest: 'lib/p5bots.min.js'
      }
    },

    release: {
      options: {
        github: {
          repo: 'sarahgp/p5bots', //put your user/repo here
          usernameVar: process.env.GITHUB_USERNAME, //ENVIRONMENT VARIABLE that contains Github username
          passwordVar: process.env.GITHUB_PASSWORD //ENVIRONMENT VARIABLE that contains Github password
        }
      }
    },
    // This is a static server which is used when testing connectivity for the
    // p5 library. This avoids needing an internet connection to run the tests.
    // It serves all the files in the test directory at http://localhost:9001/
    connect: {
      server: {
        options: {
          base: './',
          port: 9001,
          keepalive: keepalive,
          middleware: function(connect, options, middlewares) {
            middlewares.unshift(function(req, res, next) {
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', '*');
              return next();
            });
            return middlewares;
          }
        }
      }
    }
  });

  // Load the external libraries used.
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-mocha-chai-sinon');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-newer');

  // Create the multitasks.
  grunt.registerTask('build', ['browserify', 'uglify', 'requirejs']);
  grunt.registerTask('test', ['jshint', 'jscs', 'build', 'connect', 'mocha', 'mocha-chai-sinon']);
  grunt.registerTask('default', ['test', 'build']);
};
