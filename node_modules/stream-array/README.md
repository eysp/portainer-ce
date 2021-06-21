# stream-array

Pipe an Array through Node.js streams. This is rather useful for testing other
streams.

[![build status][1]][2] [![npm version][3]][4] [![dependencies][5]][6]


## Usage

```js
var streamify = require('stream-array'),
    os = require('os');

streamify(['1', '2', '3', os.EOL]).pipe(process.stdout);
```


## API

#### streamify(Array)
Provide an Array to streamify which will be iterated over. Each element will
dequeued and pushed into the following piped stream.


## Install

```
npm install stream-array
```

  [1]: https://api.travis-ci.org/mimetnet/node-stream-array.png
  [2]: https://travis-ci.org/mimetnet/node-stream-array
  [3]: https://badge.fury.io/js/stream-array.png
  [4]: https://badge.fury.io/js/stream-array
  [5]: https://david-dm.org/mimetnet/node-stream-array.png
  [6]: https://david-dm.org/mimetnet/node-stream-array

