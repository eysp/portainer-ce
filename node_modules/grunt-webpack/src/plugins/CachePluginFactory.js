'use strict';
const CachePlugin = require('webpack/lib/CachePlugin');

class CachePluginFactory {

  constructor() {
    this.plugins = {};
    this.dependencies = {};
  }

  addPlugin(target, compiler) {
    if (!this.plugins[target]) {
      this.plugins[target] = new CachePlugin();
    }
    this.plugins[target].apply(compiler);
    if (this.dependencies[target]) {
      compiler._lastCompilationFileDependencies = this.dependencies[target].file;
      compiler._lastCompilationContextDependencies = this.dependencies[target].context;
    }
  }

  updateDependencies(target, compiler) {
    this.dependencies[target] = {
      file: compiler._lastCompilationFileDependencies,
      context: compiler._lastCompilationContextDependencies
    };
  }
}

module.exports = CachePluginFactory;
