'use strict';

const mergeWith = require('lodash/mergeWith');

const gruntOptions = {
  failOnError: (options) => {
    // if watch enabled also default to failOnError false
    return Array.isArray(options) ? options.every(option => !option.watch) : !options.watch;
  },
  progress: process.stdout.isTTY,
  storeStatsTo: null,
  keepalive: (options) => {
    // if watch enabled also default to keepalive true
    return Array.isArray(options) ? options.some(option => option.watch) : !!options.watch;
  },
};

const webpackOptions = {
  stats: {
    cached: false,
    cachedAssets: false,
    colors: true,
  },
  cache: (options) => {
    // if watch enabled also default to cache true
    return Array.isArray(options) ? options.some(option => option.watch) : !!options.watch;
  }
};

const webpackDevServerOptions = {
  port: 8080,
  host: 'localhost',
  inline: true,
  keepalive: true,
  publicPath: '/',
  stats: {
    colors: true,
    cached: false,
    cachedAssets: false
  },
};

function mergeCustomize(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.concat(b);
  }
}

function mergeOptions(defaultOptions, options, targetOptions) {
  let result;
  if (Array.isArray(targetOptions)) {
    result = targetOptions.map(opt => mergeWith({}, defaultOptions, options, opt, mergeCustomize));
  } else {
    result = mergeWith({}, defaultOptions, options, targetOptions, mergeCustomize);
  }

  return result;
}

exports.gruntOptions = gruntOptions;
exports.webpackOptions = webpackOptions;
exports.webpackDevServerOptions = webpackDevServerOptions;

exports.mergeOptions = mergeOptions;
