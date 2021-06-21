'use strict';
const defaults = require('./default');
const OptionHelper = require('./OptionHelper');

class WebpackOptionHelper extends OptionHelper {

  getDefaultOptions() {
    return Object.assign({}, defaults.gruntOptions, defaults.webpackOptions);
  }

  getWebpackOptions() {
    const options = this.getOptions();

    if (Array.isArray(options)) {
      return options.map((opt) => this.filterOptions(opt));
    }

    return this.filterOptions(options);
  }

  filterOptions(options) {
    if (!options.watch) {
      // ensure cache is disabled in non watch mode, as we add our own CachePlugin to support
      // multiple targets in one run with different caches
      options.cache = false;
    }

    // ensure that when we send the cache option to webpack in watch mode it is not the function
    // TODO: this is workaround and should be handled in a more generic way
    if (typeof options.cache === 'function') {
      options.cache = options.cache(options);
    }

    return this.filterGruntOptions(options);
  }
}

module.exports = WebpackOptionHelper;
