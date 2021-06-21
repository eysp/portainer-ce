var test = require('tap').test
    , Queue = require('fastqueue');
;

/**
 * We're using some internals so lets make sure they're not different
 * than when we wrote this.
 */
test('require', function(t) {
    var q;

    t.ok(Queue, 'fastqueue exists');
    t.type(Queue, 'function', 'require returns an object');
    t.equal(0, Object.keys(Queue).length, 'No hidden exports');

    q = new Queue();

    t.type(q, 'object', 'new Queue() returns an object');
    t.type(q.length, 'number', 'q.length');

    t.ok(Array.isArray(q.head), 'q.head = []');
    t.ok(Array.isArray(q.tail), 'q.tail = []');

    q.push(1);

    t.equal(1, q.length, 'push(length == 1)');
    t.equal(1, q.shift(), 'shift');
    t.equal(0, q.length, 'length == 0');

    t.end();
});
