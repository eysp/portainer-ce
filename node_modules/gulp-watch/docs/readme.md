# Recipies

 * [Prevent pipe breaking on errors](#prevent-pipe-breaking-on-errors)
 * [Starting tasks on events](#starting-tasks-on-events)
 * [Filtering custom events](#filtering-custom-events)
 * [Incremental build](#incremental-build)

### Prevent pipe breaking on errors

> Until gulp 4.0 is released this is actual information

When you pipe one Stream to another and do not attaching `on('error')` handler they will `unpipe` on every error. This is frustraiting, when you have watcher and something like `coffeescript` builder. It is pretty easy to put typo in file and breake pipeline forever. To avoid this, you can use [`gulp-plumber`](https://github.com/floatdrop/gulp-plumber):

```js
var gulp = require('gulp');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var sass = require('gulp-ruby-sass');

gulp.task('styles', function () {  
    watch('scss/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('dist/'));
});
```

### Starting tasks on events

Often you want just to launch some tasks (like `build`) when something happened to watched files.

```js
var gulp = require('gulp');
var watch = require('gulp-watch');

gulp.task('build', function () { console.log('Working!'); });

gulp.task('watch', function () {
    watch('**/*.js', function (files, cb) {
        gulp.start('build', cb);
    });
});
```

> __Why should I use that, instead of shorter `gulp.watch('**/*.js', [build]);` ?__

Since `gulp-watch` is using `gulp-batch` for callback — it will not start another build while one is running. Instead it will buffer files, that triggered callback and run build again with all files. It often happens when you doing `git checkout` or `git reset` or have long `build` task.

### Filtering custom events

When you want to make actions only on specific events, you can use [`gulp-filter`](https://github.com/sindresorhus/gulp-filter) and the `event` attribute, which is added to all files that were `added`, `changed` or `deleted` (per [`gaze`'s documentation](https://github.com/shama/gaze#events)):

```js
var filter = require('gulp-filter');

function isAdded(file) {
    return file.event === 'added';
}

var filterAdded = filter(isAdded);

gulp.task('default', function () {
    watch('**/*.js')
        .pipe(filterAdded)
        .pipe(gulp.dest('newfiles'))
        .pipe(filterAdded.restore())
        .pipe(gulp.dest('oldfiles'));
});
```

**Notice:** `event` property is not added to files that were emitted by `emitOnGlob` and `emit: 'all'` options, only to files that actually caused the event.

### Incremental build

One of the nice features, that can be achieved with `gulp-watch` - is incremental build.
When you want to build all files at start and then get only changed files - you can use these snippets:

In callback style:

```js
gulp.task('default', function() {
    return gulp.src('js/*.js').pipe(watch('js/*.js', function(files) {
        return files.pipe(gulp.dest('.'));
    }));
});
```

Or in plain stream:

```js
gulp.task('default', function() {
    return gulp.src('js/*.js')
        .pipe(watch('js/*.js'))
        .pipe(gulp.dest('.'));
});
```

Since `gulp-watch` returns `passThrough` stream - it will reemit all incoming files in callback and in receiving stream.
