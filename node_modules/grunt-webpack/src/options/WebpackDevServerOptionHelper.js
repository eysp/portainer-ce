'use strict';
const defaults = require('./default');
const OptionHelper = require('./OptionHelper');

class WebpackOptionHelper extends OptionHelper {

  getDefaultOptions() {
    return Object.assign({}, defaults.gruntOptions, defaults.webpackDevServerOptions);
  }

  getWebpackOptions() {
    const options = this.getOptions().webpack;

    if (Array.isArray(options)) {
      return options.map((opt) => this.filterGruntOptions(opt));
    }

    return this.filterGruntOptions(options);
  }

  getWebpackDevServerOptions() {
    const options = this.getOptions();

    delete options.webpack;

    return this.filterGruntOptions(options);
  }
}

module.exports = WebpackOptionHelper;
