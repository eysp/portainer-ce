// Karma v0.13 http://karma-runner.github.io/0.13/config/configuration-file.html
// See configuration documentation above for CLI arguments
module.exports = function(config) {
  config.set({
    basePath: './..',
    frameworks: ['jasmine'],
    autoWatch: true,
    colors: true,
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'index.js',
      'test/unit/*.js'
    ],
    reporters: ['progress'],
    browsers: ['Chrome'],
    logLevel: config.LOG_INFO,
    captureTimeout: 5000,
    singleRun: false,
    port: 9876,
    runnerPort: 9100,
    reportSlowerThan: 500
  });
};
