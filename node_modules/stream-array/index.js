var Readable = require('stream').Readable
    , Queue = require('fastqueue')
;

if (!Readable) {
    Readable = require('readable-stream/readable');
}

function StreamArray(list) {
    if (!(this instanceof(StreamArray)))
        return new StreamArray(list);
    if (!Array.isArray(list))
        throw new TypeError('First argument must be an Array');

    Readable.call(this, {objectMode:true});

    this._queue = new Queue();
    this._queue.tail = list;
    this._queue.length = list.length;
}

StreamArray.prototype = Object.create(Readable.prototype, {constructor: {value: StreamArray}});

StreamArray.prototype._read = function(size) {
    this.push(this._queue.shift());
};

module.exports = function(list) {
    return new StreamArray(list);
};
