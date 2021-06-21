let webpackConfig = require('./webpack.config');
let generateJsonPlugin = require('generate-json-webpack-plugin');

webpackConfig.devtool = 'source-map';
webpackConfig.plugins = webpackConfig.plugins.filter(plugin => !(plugin instanceof generateJsonPlugin));

module.exports = function (config) {
	config.set({
		files: [
			'node_modules/jquery/dist/jquery.js',
			'node_modules/angular/angular.js',
			'node_modules/angular-mocks/angular-mocks.js',
			'node_modules/moment/min/moment-with-locales.js',
			'src/index.ts',
			'tests/hacks.ts',
			'tests/**/!(hacks|utility).ts'
		],
		preprocessors: {
			'**/*.ts': ['webpack']
		},
		webpack: webpackConfig,
		webpackMiddleware: {
			noInfo: true,
			stats: 'errors-only'
		},
		mime: {
			'text/x-typescript': ['ts']
		},
		frameworks: ['jasmine'],
		browsers: ['PhantomJS'],
		singleRun: true
	});
};