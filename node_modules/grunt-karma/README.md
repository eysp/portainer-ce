#grunt-karma
Grunt plugin for [Karma](https://github.com/karma-runner/karma)
NOTE: this plugin requires Grunt 0.4.x

##Getting Started
From the same directory as your project's Gruntfile and package.json, install this plugin with the following command:

`npm install grunt-karma --save-dev`

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('grunt-karma');
```

##Config
Inside your `Gruntfile.js` file, add a section named *karma*, containing any number of configurations for running karma. The only required option is the path to the [karma config file](http://karma-runner.github.com/0.8/config/configuration-file.html). Here's a simple example:

```js
karma: {
  unit: {
    configFile: 'karma.conf.js'
  }
}
```

You can override any of the config file's settings directly:

```js
karma: {
  unit: {
    configFile: 'karma.conf.js',
    runnerPort: 9999,
    singleRun: true,
    browsers: ['PhantomJS']
  }
}
```

##Sharing Configs
If you have multiple targets, it may be helpful to share common configuration settings between them. Grunt-karma supports this by using the `options` property:

```js
karma: {
  options: {
    configFile: 'karma.conf.js',
    runnerPort: 9999,
    browsers: ['Chrome', 'Firefox']
  },
  continuous: {
    singleRun: true
    browsers: ['PhantomJS']
  },
  dev: {
    reporters: 'dots'
  }
}
```

In this example the `continuous` and `dev` targets will both use the `configFile` and `runnerPort` specified in the `options`. But the `continuous` target will override the browser setting to use PhantomJS, and also run as a singleRun. The `dev` target will simply change the reporter to dots.

##Running tests
There are three ways to run your tests with karma:

###Karma Server with Auto Runs on File Change
Setting the `autoWatch` option to true will instruct karma to start a server and watch for changes to files, running tests automatically:

```js
karma: {
  unit: {
    configFile: 'karma.conf.js',
    autoWatch: true
  }
}
```
Now run `$ grunt karma`

However, usually Grunt projects watch many types of files using [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch) or [grunt-regarde](https://github.com/yeoman/grunt-regarde), so this option isn't preferred.

###Karma Server with Grunt Watch/Regarde
Config karma like usual (without the autoWatch option), and add `background:true`:

```js
karma: {
  unit: {
    configFile: 'karma.conf.js',
    background: true
  }
}
```
The `background` option will tell grunt to run karma in a child process so it doesn't block subsequent grunt tasks.

Config your `watch` or `regarde` task to run the karma task with the `:run` flag. For example:

```js
watch: {
  //run unit tests with karma (server needs to be already running)
  karma: {
    files: ['app/js/**/*.js', 'test/browser/**/*.js'],
    tasks: ['karma:unit:run'] //NOTE the :run flag
  }
},
```

In your terminal window run `$ grunt karma:unit watch`, which runs both the karma task and the watch task. Now when grunt watch detects a change to one of your watched files, it will run the tests specified in the `unit` target using the already running karma server. This is the preferred method for development.

###Single Run
Keeping a browser window & karma server running during development is productive, but not a good solution for build processes. For that reason karma provides a "continuous integration" mode, which will launch the specified browser(s), run the tests, and close the browser(s). It also supports running tests in [PhantomJS](http://phantomjs.org/), a headless webkit browser which is great for running tests as part of a build. To run tests in continous integration mode just add the `singleRun` option:

```js
karma: {
  unit: {
    configFile: 'config/karma.conf.js',
  },
  //continuous integration mode: run tests once in PhantomJS browser.
  continuous: {
    configFile: 'config/karma.conf.js',
    singleRun: true,
    browsers: ['PhantomJS']
  },
}
```

The build would then run `grunt karma:continuous` to start PhantomJS, run tests, and close PhantomJS.

##License
MIT License