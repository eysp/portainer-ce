'use strict';

let fs = require('fs');
let path = require('path');
let pkg = require('./package');
let bower = require('./bower');
let semver = require('semver');
let webpack = require('webpack');
let autoprefixer = require('autoprefixer');
let extractTextPlugin = require('extract-text-webpack-plugin');
let generateJsonPlugin = require('generate-json-webpack-plugin');

let isProduction = process.argv.indexOf('-p') != -1;
let filesuffix = (isProduction ? '.min' : '');
let filename = 'angular-moment-picker' + filesuffix;
let increase = (process.argv.filter(argv => argv.match(/^increase=.+$/))[0] || '').replace('increase=', '');

// sync bower.json with package.json
pkg.version = increase ? semver.inc(pkg.version, increase) : pkg.version;
['name', 'version', 'description', 'homepage', 'license', 'keywords', 'dependencies'].forEach(field => bower[field] = pkg[field]);

// themes - read file from `src/themes` folder
let themes = [];
fs.readdirSync('src/themes').forEach(file => themes.push(file.replace('.less', '')));

// extract plugin settings for css file generation
let extractBaseTheme = new extractTextPlugin(filename + '.css');
let extractOtherThemes = themes.map(theme => ({
	file: path.resolve(__dirname, 'src/themes/' + theme + '.less'),
	extract: new extractTextPlugin('themes/' + theme + filesuffix + '.css')
}));
let extractPluginLoaders = [
	'css-loader',
	{ loader: 'postcss-loader', options: { plugins: [ autoprefixer({ browsers: ['> 0%'] }) ] } },
	'less-loader'
];

module.exports = {
	entry: [
		'./src/index.ts',
		'./src/index.less',
		...extractOtherThemes.map(theme => theme.file)
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: filename + '.js'
	},
	bail: true,
	externals: Object.keys(pkg.dependencies),
	resolve: {
		extensions: ['.ts', '.html', '.less']
	},
	module: {
		rules: [
			{ test: /\.ts$/, use: ['ts-loader', 'tslint-loader'] },
			{ test: /\.html$/, use: 'html-loader?minimize=true' },
			{ test: /\.less$/, exclude: /themes/, use: extractBaseTheme.extract(extractPluginLoaders) },
			...extractOtherThemes.map(theme => {
				return { include: theme.file, use: theme.extract.extract(extractPluginLoaders) };
			})
		]
	},
	plugins: [
		extractBaseTheme,
		...extractOtherThemes.map(theme => theme.extract),
		new webpack.BannerPlugin('Angular Moment Picker - v' + pkg.version + ' - ' + pkg.homepage + ' - (c) 2015 Indri Muska - ' + pkg.license),
		new generateJsonPlugin('../bower.json', bower, undefined, 2),
		new generateJsonPlugin('../package.json', pkg, undefined, 2)
	]
};