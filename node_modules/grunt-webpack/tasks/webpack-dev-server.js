'use strict';
const webpack = require('webpack');
const OptionHelper = require('../src/options/WebpackDevServerOptionHelper');
const ProgressPluginFactory = require('../src/plugins/ProgressPluginFactory');

function colorInfo(useColor, msg) {
  // Make text blue and bold, so it *pops*
  if (useColor) return `\u001b[1m\u001b[34m${msg}\u001b[39m\u001b[22m`;

  return msg;
}

function reportReadiness(uri, options, grunt) {
  const useColor = !options.stats || options.stats.colors;

  grunt.log.writeln((options.progress ? '\n' : '') + `Project is running at ${colorInfo(useColor, uri)}`);

  grunt.log.writeln(`webpack output is served from ${colorInfo(useColor, options.publicPath)}`);
  const contentBase = Array.isArray(options.contentBase) ? options.contentBase.join(', ') : options.contentBase;
  if (contentBase)
    grunt.log.writeln(`Content not from webpack is served from ${colorInfo(useColor, contentBase)}`);
  if (options.historyApiFallback)
    grunt.log.writeln(`404s will fallback to ${colorInfo(useColor, options.historyApiFallback.index || '/index.html')}`);
}

module.exports = (grunt) => {
  let WebpackDevServer;
  try {
    WebpackDevServer = require('webpack-dev-server');
  } catch (err) {
    grunt.registerTask('webpack-dev-server', 'webpack-dev-server not installed.', () => {
      grunt.fail.fatal(
        `webpack-dev-server is currently not installed, this task will do nothing.

To fix this problem install webpack-dev-server by doing either
yarn add webpack-dev-server --dev
or
npm install --save-dev webpack-dev-server
`);
    });
    return;
  }

  if (typeof WebpackDevServer.addDevServerEntrypoints !== 'function') {
    grunt.fail.fatal('webpack-dev-server is outdated. Please ensure you have at least version 2.4.0 installed.');
  }

  let createDomain;
  try {
    createDomain = require('webpack-dev-server/lib/utils/createDomain');
  } catch (err) {
    createDomain = require('webpack-dev-server/lib/util/createDomain');
  }

  const processPluginFactory = new ProgressPluginFactory(grunt);

  grunt.registerTask('webpack-dev-server', 'Start a webpack-dev-server.', function webpackDevServerTask(cliTarget) {
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
      done(new Error('No configuration was found for webpack-dev-server. For further assistance on how to create the config refer to https://github.com/webpack-contrib/grunt-webpack/blob/master/README.md#grunt-webpack'));
      return;
    }

    targets.forEach((target) => {
      if (target === 'options') {
        runningTargetCount--;
        return;
      }

      const optionHelper = new OptionHelper(grunt, this.name, target);
      const opts = optionHelper.getOptions();
      const webpackOptions = optionHelper.getWebpackOptions();

      WebpackDevServer.addDevServerEntrypoints(webpackOptions, opts);

      if (opts.inline && (opts.hotOnly || opts.hot)) {
        webpackOptions.plugins = webpackOptions.plugins || [];
        webpackOptions.plugins.push(new webpack.HotModuleReplacementPlugin());
      }

      const compiler = webpack(webpackOptions);

      if (opts.progress) processPluginFactory.addPlugin(compiler, webpackOptions);

      (new WebpackDevServer(compiler, optionHelper.getWebpackDevServerOptions())).listen(opts.port, opts.host, () => {
        const app = {
          address() {
            return { port: opts.port };
          }
        };

        const suffix = opts.inline !== false || opts.lazy === true ? '/' : '/webpack-dev-server/';
        const uri = createDomain(opts, app) + suffix;
        reportReadiness(uri, opts, grunt);
        keepalive = keepalive || opts.keepalive;
        if (--runningTargetCount === 0 && !keepalive) done();
      });
    });
  });
};
