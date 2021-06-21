'use strict';

function nop() {}

var util = require('gulp-util'),
    PluginError = require('gulp-util').PluginError,
    Duplex = require('readable-stream').Duplex,
    batch = require('gulp-batch'),
    vinyl = require('vinyl-file'),
    File = require('vinyl'),
    glob2base = require('glob2base'),
    path2glob = require('path2glob'),
    sep = require('path').sep;

function isDirectory(path) {
    return path[path.length - 1] === sep;
}

module.exports = function (globs, opts, cb) {
    if (!globs) throw new PluginError('gulp-watch', 'glob argument required');

    if (typeof globs === 'string') globs = [ globs ];

    if (!Array.isArray(globs)) {
        throw new PluginError('gulp-watch', 'glob should be String or Array, not ' + (typeof globs));
    }

    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }

    if (!opts) opts = {};

    var baseForced = !!opts.base;
    var outputStream = new Duplex({ objectMode: true, allowHalfOpen: true });

    cb = cb ? batch(opts, cb, outputStream.emit.bind(outputStream, 'error')) : nop;

    outputStream._write = function _write(file, enc, done) {
        cb(file);
        outputStream.push(file);
        done();
    };

    outputStream._read = function _read() { };

    var Gaze = require('gaze');
    var gaze = outputStream._gaze = new Gaze(globs, opts);

    gaze.on('all', processEvent);

    function write(event, err, file) {
        if (err) { return outputStream.emit('error', err); }
        if (opts.verbose !== false) { log(event, file); }
        file.event = event;
        outputStream.push(file);
        cb(file);
    }

    function processEvent(event, filepath) {
        var glob = path2glob(filepath, globs, opts);

        if (!glob && opts.verbose !== false) {
            log('not matched by globs', { relative: filepath });
        }

        opts.path = filepath;

        if (!baseForced) opts.base = glob ? glob2base(glob) : undefined;

        if (event === 'deleted' || isDirectory(filepath)) {
            return write(event, null, new File(opts));
        }

        vinyl.read(filepath, opts, write.bind(null, event));
    }

    gaze.on('error', outputStream.emit.bind(outputStream, 'error'));
    gaze.on('ready', outputStream.emit.bind(outputStream, 'ready'));
    gaze.on('end', outputStream.emit.bind(outputStream, 'end'));

    outputStream.close = function () { gaze.close(); };

    function log(event, file) {
        var msg = [util.colors.magenta(file.relative), 'was', event];
        if (opts.name) { msg.unshift(util.colors.cyan(opts.name) + ' saw'); }
        util.log.apply(util, msg);
    }

    return outputStream;
};
