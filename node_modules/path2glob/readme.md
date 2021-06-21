# path2glob

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

Get best matching glob from globs array for given path.

> __Tip__: negatives will be filtered

## Usage

```js
var path2glob = require('path2glob');

var globs = [
    './libs/**/*.js',
    './libs/src/**/*.js',
];

console.log(path2glob('/User/someone/libs/bird/word.js', globs)); // './libs/**/*.js'
console.log(path2glob('/User/someone/libs/src/word.js', globs)); // './libs/src/**/*.js'
```

## API

### path2glob(path, globs, [opts])

Returns best matching glob from `globs` array.

## License

MIT (c) 2014 Vsevolod Strukchinsky

[npm-url]: https://npmjs.org/package/path2glob
[npm-image]: http://img.shields.io/npm/v/path2glob.svg?style=flat

[travis-url]: http://travis-ci.org/floatdrop/path2glob
[travis-image]: http://img.shields.io/travis/floatdrop/path2glob.svg?branch=master&style=flat

[depstat-url]: https://david-dm.org/floatdrop/path2glob
[depstat-image]: http://img.shields.io/david/floatdrop/path2glob.svg?style=flat
