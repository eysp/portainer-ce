'use strict';

var resolve = require('path').resolve;
var Glob = require('glob').Glob;

function isNegative(pattern) {
    if (typeof pattern !== 'string') return true;
    if (pattern[0] === '!') return true;
    return false;
}

function isPositive(pattern) {
    return !isNegative(pattern);
}

function notAsterisk(item) {
    return item._glob === undefined;
}

function isMatching(path) {
    return function (glob) {
        return glob.minimatch.match(path);
    };
}

module.exports = function (path, globs, opts) {
    if (!path || typeof path !== 'string') throw new Error('path should be a string');

    if (!Array.isArray(globs)) throw new Error('globs should be Array of strings');

    opts = opts || {};
    opts.cwd = opts.cwd || process.cwd();

    function toGlob(glob) {
        return new Glob(resolve(opts.cwd, glob), opts);
    }

    globs = globs
                .filter(isPositive)
                .map(toGlob)
                .filter(isMatching(path));

    if (globs.length === 1) { return globs[0]; }

    var best = { count: -1 };
    for (var i = 0; i < globs.length; i++) {
        var glob = globs[i];
        var count = glob.minimatch.set[0].filter(notAsterisk).length;
        if (count > best.count) {
            best = {
                glob: glob,
                count: count
            };
        }
    }

    return best.glob;
};
