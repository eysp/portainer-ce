# Fast Queue

While normal JavaScript arrays can be used as FIFO queues, the `.shift()` call is very slow if the queue gets large because it has to reindex all the remaining items on every shift.

This library is a fast queue that only implements `.push(item)`, `.shift()`, `.unshift(item)` and `.length` from the Array interface.

Internally it uses two arrays and cycles them and uses counters so that the `.shift()` calls are still fast.

## Usage

```js
var Queue = require('fastqueue');

var q = new Queue;
q.push(1);
q.push(2);
q.push(3);
var i = 4;
while (q.length > 0) {
  console.log(q.length, q.shift());
  q.unshift(i++);
  console.log(q.length, q.shift());
  q.push(i++);
  console.log(q.length, q.shift());
}
```
