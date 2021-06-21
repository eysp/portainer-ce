var tap = require('tap')
    , test = tap.test
    , streamify
;

test('require', function(t) {
    streamify = require('..');

    t.ok(streamify, 'stream-array exists');
    t.type(streamify, 'function', 'require returns an object');
    t.equal(0, Object.keys(streamify).length, 'No hidden exports exports');
    t.equal(1, streamify.length, 'No hidden arguments');
    t.end();
});
