'use strict';

var array = require('stream-array');
var asyncDone = require('async-done');

module.exports = function (opts, cb, errorHandler) {
    if (typeof opts === 'function') {
        errorHandler = cb;
        cb = opts;
        opts = {};
    }

    if (typeof cb !== 'function') {
        throw new Error('Provided callback is not a function: ' + cb);
    }

    opts.timeout = opts.timeout || 100;

    var batch = [];
    var holdOn;
    var timeout;

    function setupFlushTimeout() {
        if (!holdOn && batch.length) {
            timeout = setTimeout(flush, opts.timeout);
        }
    }

    function flush() {
        var holdOn = true;
        asyncDone(cb.bind(cb, array(batch)), function (err) {
            holdOn = false;
            if (err && typeof errorHandler === 'function') { errorHandler(err); }
        });
        batch = [];
    }

    return function (event) {
        batch.push(event);

        if (timeout) { clearTimeout(timeout); }

        if (opts.limit && batch.length >= opts.limit) {
            flush();
        } else {
            setupFlushTimeout();
        }
    };
};
