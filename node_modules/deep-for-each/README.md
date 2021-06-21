# deep-for-each

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url] [![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]

[npm-url]:https://npmjs.org/package/deep-for-each
[downloads-image]:http://img.shields.io/npm/dm/deep-for-each.svg
[npm-image]:http://img.shields.io/npm/v/deep-for-each.svg
[travis-url]:https://travis-ci.org/moxystudio/js-deep-for-each
[travis-image]:http://img.shields.io/travis/moxystudio/js-deep-for-each/master.svg
[codecov-url]:https://codecov.io/gh/moxystudio/js-deep-for-each
[codecov-image]:https://img.shields.io/codecov/c/github/moxystudio/js-deep-for-each/master.svg
[david-dm-url]:https://david-dm.org/moxystudio/js-deep-for-each
[david-dm-image]:https://img.shields.io/david/moxystudio/js-deep-for-each.svg
[david-dm-dev-url]:https://david-dm.org/moxystudio/js-deep-for-each?type=dev
[david-dm-dev-image]:https://img.shields.io/david/dev/moxystudio/js-deep-for-each.svg
[greenkeeper-image]:https://badges.greenkeeper.io/moxystudio/js-deep-for-each.svg
[greenkeeper-url]:https://greenkeeper.io/

Recursively iterates over arrays and objects. The iteration is made using a [deep-first](https://en.wikipedia.org/wiki/Depth-first_search) algorithm.


## Installation

`$ npm install deep-for-each`

This library expects the host environment to be up-to-date or polyfilled with [core-js](https://github.com/zloirock/core-js) or similar.


## Usage

```js
import deepForEach from 'deep-for-each';

deepForEach({
    prop1: 'foo',
    prop2: ['foo', 'bar'],
    prop3: ['foo', 'foo'],
    prop4: {
        prop5: 'foo',
        prop6: 'bar',
    },
}, (value, key, subject, path) => {
    // `value` is the current property value
    // `key` is the current property name
    // `subject` is either an array or an object
    // `path` is the iteration path, e.g.: 'prop2[0]' and 'prop4.prop5'

    console.log(`${path}:`, value);
});
```

Running the example above will print:

```
prop1: foo
prop2: [ 'foo', 'bar' ]
prop2[0]: foo
prop2[1]: bar
prop3: [ 'foo', 'foo' ]
prop3[0]: foo
prop3[1]: foo
prop4: { prop5: 'foo', prop6: 'bar' }
prop4.prop5: foo
prop4.prop6: bar
```


## Tests

`$ npm test`   
`$ npm test -- --watch` during development


## License

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
