# angular-clipboard

[![Build Status](https://img.shields.io/travis/omichelsen/angular-clipboard/master.svg)](https://travis-ci.org/omichelsen/angular-clipboard)
[![Test Coverage](https://img.shields.io/coveralls/omichelsen/angular-clipboard/master.svg)](https://coveralls.io/r/omichelsen/angular-clipboard?branch=master)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/angular-clipboard.svg)](https://bundlephobia.com/result?p=angular-clipboard)

Copy text to clipboard by clicking a button without using Flash. This is using the [Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection) and [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent) available in newer browsers.

Browser support: Chrome 43+, Firefox 41+, Opera 29+, IE10+, Safari 10+ and Mobile Safari 10+.

See the [demo](https://rawgit.com/omichelsen/angular-clipboard/master/demo/index.html).

## Install

```bash
$ npm install angular-clipboard --save
```

angular-clipboard has no other dependencies than [Angular](https://angularjs.org/)
itself.

## Usage

Require angular-clipboard as a dependency for your app:

```javascript
angular.module('MyApp', ['angular-clipboard'])
    .controller('MyController', ['$scope', function ($scope) {
        $scope.supported = false;

        $scope.textToCopy = 'I can copy by clicking!';

        $scope.success = function () {
            console.log('Copied!');
        };

        $scope.fail = function (err) {
            console.error('Error!', err);
        };
    }]);
```

Copy text from an input field by clicking a button:

```html
<input type="text" ng-model="textToCopy">
<button clipboard supported="supported" text="textToCopy" on-copied="success()" on-error="fail(err)">Copy</button>
```

You can supply a method to be called for the `on-copied` and `on-error` event. The `on-error` function will be called with the error object as argument `err`.

The optional `supported` property can be used to detect browser support for the clipboard feature.

### Use as service

You can also invoke the copy to clipboard action directly by injecting the `clipboard` service. Just remember it has to be in a click event, as clipboard access requires user action.

```javascript
angular.module('MyApp', ['angular-clipboard'])
    .controller('MyController', ['$scope', 'clipboard', function ($scope, clipboard) {
        if (!clipboard.supported) {
            console.log('Sorry, copy to clipboard is not supported');
        }

        $scope.clickHandler = function () {
            clipboard.copyText('Copy this text');
        };
    }]);
```

### Use with a module loader

If you are using a module loader, you can import the module name when requiring it in angular. Works with any AMD/UMD/CommonJS module loader.

```javascript
import clipboardModule from 'angular-clipboard';

angular.module('mymodule', [clipboardModule.name]);
```
