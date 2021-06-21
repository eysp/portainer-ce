/*
 * grunt-env
 * https://github.com/onehealth/grunt-env
 *
 * Copyright (c) 2012 OneHealth Solutions, inc
 * Licensed under the Apache 2.0 license.
 */

'use strict';

var _ = require('lodash');
var path = require('path');
var utils = require('../lib/utils');

module.exports = function(grunt) {
  var parse = function(file) {
    // pass grunt reference to parse
    return utils.parse(grunt, file);
  };

  grunt.registerMultiTask('env', 'Specify an ENV configuration for future tasks in the chain', function() {

    var data = _.clone(this.data);
    delete data.src;
    processDirectives(data);

    var options = this.options();

    if (this.files.length) {
      if (options.envdir) {
        var d = _.zipObject(this.files[0].src.map(function(file) {
          if (grunt.file.isFile(file)) {
            return [path.basename(file), parse(file)];
          }
        }));
        processDirectives(d);
      } else {
        this.files[0].src.forEach(function(file) {
          processDirectives(parse(file));
        });
      }
    }

    delete options.envdir;
    processDirectives(options);
  });

  function processDirectives(options) {

    var dispatch = {
      add : add,
      replace : replace,
      unshift : arrayLike.bind({}, 'unshift'),
      push : arrayLike.bind({}, 'push'),
      concat : arrayLike.bind({}, 'push')
    };

    _.forEach(options, function(optionData, option) {
      if (option === 'options') {
        return;
      }
      var fn = dispatch[option];
      if (fn && typeof optionData === 'object') {
        _.forEach(optionData, fn);
      } else {
        var data = {};
        data[option] = typeof optionData === 'function' ? optionData() : optionData;
        _.extend(process.env, data);
      }
    });
  }

  function add(value, key) {
    if (process.env[key]) {
      return grunt.verbose.writeln(key + ' already exists, leaving unchanged.');
    }

    var data = {};
    data[key] = value;
    _.extend(process.env, data);
  }

  function replace(value, key) {
    if (!process.env[key]) {
      return grunt.verbose.writeln(key + ' doesn\'t exist, refusing to replace.');
    }
    process.env[key] = value;
  }

  function arrayLike(method, value, key) {
    process.env[key] = process.env[key] || '';
    var delimiter = value ? value.delimiter || '' : '';

    if (typeof value === 'object') {
      value = value.value;
    }

    if (method === 'unshift') {
      process.env[key] = value + delimiter + process.env[key];
    } else if (method === 'push') {
      process.env[key] += delimiter + value;
    }
  }
};
