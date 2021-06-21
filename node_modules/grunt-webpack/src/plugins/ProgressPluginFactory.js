'use strict';
const ProgressPlugin = require('webpack/lib/ProgressPlugin');

class ProgressPluginFactory {

  constructor(grunt) {
    this.grunt = grunt;
  }

  addPlugin(compiler, options) {
    (new ProgressPlugin({ profile: options.profile })).apply(compiler);
  }
}

module.exports = ProgressPluginFactory;
