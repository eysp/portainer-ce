var tap = require('tap')
    , test = tap.test
    , streamify = require('..')
    , concat = require('concat-stream')
;

test('array of strings', function(t) {
    var s = streamify(['1', '2', '3', 'Four']);

    s.pipe(concat(function(res) {
        t.equal(1, arguments.length, 'concat returns 1 arg');
        t.equal('123Four', res.toString(), 'result matches expectation');
        t.end();
    }));
});

test('array of buffers', function(t) {
    var s = streamify([new Buffer('One'), new Buffer('Two')]);

    s.pipe(concat(function(res) {
        t.equal(1, arguments.length, 'concat returns 1 arg');
        t.equal('OneTwo', res.toString(), 'result matches expectation');
        t.end();
    }));
});
