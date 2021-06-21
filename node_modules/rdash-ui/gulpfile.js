var gulp = require('gulp'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    rimraf = require('gulp-rimraf')
watch = require('gulp-watch');

var paths  = {
    fonts: 'fonts/**.*',
    images: 'img/**/*.*',
    styles: 'less/**/*.less',
};

/**
 * Watch src and execute tasks when changes are made
 */
gulp.task('watch', function() {
    gulp.watch([paths.styles], ['less', 'livereload']);
    gulp.watch([paths.fonts], ['fonts', 'livereload']);
});

/*
 * Serve the files out of /dist
 */
gulp.task('connect', function() {
    connect.server({
        root: 'dist',
        livereload: true,
        port: 8888
    });
});

/*
 * Reload the web server
 */
gulp.task('livereload', function() {
    gulp.src('index.html')
        .pipe(connect.reload());
});

/*
 * Cleans the distribution directory
 */
gulp.task('clean', ['clean-css', 'clean-images', 'clean-fonts', 'clean-dist']);

gulp.task('clean-dist', function() {
    return gulp.src('dist', {
            read: false
        })
        .pipe(rimraf({
            force: true
        }));
});

gulp.task('clean-css', function() {
    return gulp.src('dist/css/*', {
            read: false
        })
        .pipe(rimraf({
            force: true
        }));
});

gulp.task('clean-images', function() {
    return gulp.src('dist/img/*', {
            read: false
        })
        .pipe(rimraf({
            force: true
        }));
});

gulp.task('clean-fonts', function() {
    return gulp.src('dist/fonts/*', {
            read: false
        })
        .pipe(rimraf({
            force: true
        }));
});

/*
 * Copy fonts to dist directory
 */
gulp.task('fonts', function() {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest('dist/fonts'));
});

/**
 * Compile less
 */
gulp.task('less', function() {
    gulp.src(paths.styles)
        .pipe(less())
        .pipe(concat('rdash.css'))
        .pipe(gulp.dest('dist/css'));

    return gulp.src('dist/css/rdash.css')
        .pipe(minifycss())
        .pipe(rename('rdash.min.css'))
        .pipe(gulp.dest('dist/css/'))    
});

/*
 * Copy assets and compile less.
 */
gulp.task('build', ['fonts', 'less']);

gulp.task('default', ['build', 'connect', 'livereload', 'watch']);