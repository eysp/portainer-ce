'use strict';

module.exports = function(config) {
    config.set({
        files: [
            'node_modules/angular/angular.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'src/**/*.js',
            'test/unit/**/*.js',
        ],
        frameworks: ['jasmine'],
        plugins : [
            'karma-jasmine'
        ]
    });
};