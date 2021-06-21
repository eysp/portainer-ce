'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();
var karma = require('karma');
var del = require('del');

gulp.task('default', function () {
    var c = {
        reset: '\x1b[0m',
        bold: '\x1b[1m',
        green: '\x1b[32m',
        magenta: '\x1b[35m'
    };

    console.log('');
    console.log(c.green + c.bold + 'Main Commands' + c.reset);
    console.log(c.green + '-------------------------------------------' + c.reset);
    console.log(c.green + 'clean' + c.reset + ' - delete the dist/ folder.');
    console.log(c.green + 'build' + c.reset + ' - execute the release build and output into the dist/ folder.');
    console.log('');
    console.log(c.green + c.bold + 'All Commands' + c.reset);
    console.log(c.green + '-------------------------------------------' + c.reset);
    console.log(Object.keys(gulp.tasks).sort().join('\n'));
    console.log('');
    return;
});

gulp.task('build:styles', function () {
    return gulp.src([
            'src/**/*.less'
        ])
        .pipe($.plumber())
        .pipe($.concat('angular-json-tree.css'))
        .pipe($.less())
        .pipe($.autoprefixer({ browsers: ['> 1%'] }))
        .pipe($.size({ title: 'CSS:' }))
        .pipe(gulp.dest('dist'));
});

gulp.task('build:scripts', function () {
    return gulp.src('src/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.concat('angular-json-tree.js'))
        .pipe($.size({ title: 'JS:' }))
        .pipe(gulp.dest('dist'));
});

gulp.task('build:scripts:min', ['build:scripts'], function () {
    return gulp.src('dist/**/*.js')
        .pipe($.uglify({
            preserveComments: 'license'
        }))
        .pipe($.rename({extname: ".min.js"}))
        .pipe($.size({ title: 'JS min:' }))
        .pipe(gulp.dest('dist'));
})

gulp.task('build', ['clean'], function (done) {
    return gulp.start(['build:styles', 'build:scripts:min']);
});

gulp.task('clean', function () {
    return del(['dist/']);
});
