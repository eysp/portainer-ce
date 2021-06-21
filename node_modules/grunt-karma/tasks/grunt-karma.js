/*
 * grunt-karma
 * https://github.com/karma-runner/grunt-karma
 *
 * Copyright (c) 2013 Dave Geddes
 * Licensed under the MIT license.
 */

var runner = require('karma').runner;
var server = require('karma').server;
var path = require('path');

module.exports = function(grunt) {
  var _ = grunt.util._;

  grunt.registerMultiTask('karma', 'run karma.', function() {
    var done = this.async();
    var options = this.options({
      background: false
    });
    var data = this.data;
    //merge options onto data, with data taking precedence
    data = _.merge(options, data);
    data.configFile = path.resolve(data.configFile);

    if (data.configFile) {
      data.configFile = grunt.template.process(data.configFile);
    }
    //support `karma run`, useful for grunt watch
    if (this.flags.run){
      runner.run(data, done);
      return;
    }
    //allow karma to be run in the background so it doesn't block grunt
    if (data.background){
      grunt.util.spawn({cmd: 'node', args: [path.join(__dirname, '..', 'lib', 'background.js'), JSON.stringify(data)]}, function(){});
      done();
    }
    else {
      server.start(data, finished.bind(done));
    }
  });
};

function finished(code){ return this(code === 0); }
