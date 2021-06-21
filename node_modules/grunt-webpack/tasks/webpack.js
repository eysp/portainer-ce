'use strict';
const webpack = require('webpack');
const pkg = require('../package.json');
const OptionHelper = require('../src/options/WebpackOptionHelper');
const CachePluginFactory = require('../src/plugins/CachePluginFactory');
const ProgressPluginFactory = require('../src/plugins/ProgressPluginFactory');

module.exports = (grunt) => {
  const cachePluginFactory = new CachePluginFactory();
  const processPluginFactory = new ProgressPluginFactory(grunt);

  grunt.registerTask('webpack', 'Run webpack.', function webpackTask(cliTarget) {
    const done = this.async();

    const config = grunt.config([this.name]);
    const targets = cliTarget
      ? [cliTarget]
      : config
        ? Object.keys(config)
        : [];
    let runningTargetCount = targets.length;
    let keepalive = false;

    if (runningTargetCount === 0) {
      done(new Error('No configuration was found for webpack. For further assistance on how to create the config refer to https://github.com/webpack-contrib/grunt-webpack/blob/master/README.md#grunt-webpack'));
      return;
    }

    targets.forEach((target) => {
      if (target === 'options') {
        runningTargetCount--;
        return;
      }

      const optionHelper = new OptionHelper(grunt, this.name, target);

      const watch = optionHelper.get('watch');
      const opts = {
        cache: watch ? false : optionHelper.get('cache'),
        failOnError: optionHelper.get('failOnError'),
        keepalive: optionHelper.get('keepalive'),
        progress: optionHelper.get('progress'),
        stats: optionHelper.get('stats'),
        storeStatsTo: optionHelper.get('storeStatsTo'),
        watch: watch,
      };

      const webpackOptions = optionHelper.getWebpackOptions();

      const compiler = webpack(webpackOptions);

      if (opts.cache) cachePluginFactory.addPlugin(target, compiler);
      if (opts.progress) processPluginFactory.addPlugin(compiler, webpackOptions);

      const handler = (err, stats) => {
        if (opts.cache) cachePluginFactory.updateDependencies(target, compiler);
        if (err) return done(err);

        if (opts.stats && !stats.hasErrors()) {
          grunt.log.writeln(
            stats
              .toString(opts.stats)
              // add plugin version with and without colors
              .replace(/(\n(.*)Version: webpack (.*)\d+\.\d+\.\d+(.*))\n/, `$1$2 / grunt-webpack $3${pkg.version}$4\n`)
          );
        }

        if (typeof opts.storeStatsTo === 'string') {
          grunt.config.set(opts.storeStatsTo, stats.toJson(opts.stats));
        }

        if (stats.hasErrors()) {
          // in case opts.stats === false we still want to display errors.
          grunt.log.writeln(stats.toString(opts.stats || 'errors-only'));
          if (opts.failOnError) {
            // construct error without stacktrace, as the stack is not relevant here
            const error = new Error();
            error.stack = null;
            return done(error);
          }
        }

        keepalive = keepalive || opts.keepalive;

        if (--runningTargetCount === 0 && !keepalive) done();
      };

      if (opts.watch) {
        compiler.watch(webpackOptions.watchOptions || {}, handler);
      } else {
        compiler.run(handler);
      }
    });
  });
};
