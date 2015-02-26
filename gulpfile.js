'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');

var buildDirectory = 'build';

var files = [
    //Fixtures
    'test/fixtures/fixtures.js',
    'test/fixtures/**/*.js',

    //Jasmine spec files
    'test/specs/**/*_spec.js'
];

gulp.task('testcoverage', function (cb) {
    var jasmine = require('gulp-jasmine');
    var istanbul = require('gulp-istanbul');

    gulp.src('src/**/*.js')
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', function () {
            gulp.src(files)
                .pipe(jasmine())
                .pipe(istanbul.writeReports())
                .on('end', cb);
        });
});

gulp.task('test', function () {
    var jasmine = require('gulp-jasmine');

    return gulp.src(files)
        .pipe(jasmine());
});

gulp.task('e2e', ['build'], function () {
    var files = [
        'test/fixtures/**/*.js',
        'node_modules/jquery/dist/jquery.js',
        'build/d2.js',
        'test/e2e/**/*_spec.js'
    ];

    return gulp.src(files).pipe(runKarma());
});

gulp.task('e2e-watch', ['build'], function () {
    var e2eFiles = [
        'test/fixtures/**/*.js',
        'node_modules/jquery/dist/jquery.js',
        'src/**/*.js',
        'test/e2e/**/*_spec.js'
    ];

    return gulp.src(e2eFiles).pipe(runKarma(true));
});

gulp.task('watch', function () {
    return gulp.watch([
        'src/**/*.js',
        'test/**/*.js'
    ], ['test']);
});

gulp.task('jshint', function () {
    var jshint = require('gulp-jshint');
    return gulp.src([
            'test/e2e/**/*.js',
            'test/specs/**/*.js',
            'src/**/*.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', function () {
    var jscs = require('gulp-jscs');
    return gulp.src([
        'test/e2e/**/*.js',
        'test/specs/**/*.js',
        'src/**/*.js'
    ]).pipe(jscs('./.jscsrc'));
});

gulp.task('clean', function () {
    del(buildDirectory);
});

gulp.task('travis', function () {
    return runSequence('testcoverage', 'e2e', 'jshint', 'jscs');
});


gulp.task('build', ['clean'], function () {
    var browserify = require('browserify');
    var source = require('vinyl-source-stream');
    var buffer = require('vinyl-buffer');
    var sourcemaps = require('gulp-sourcemaps');

    // Single entry point to browserify
    return browserify({
            debug : true
        })
        .transform({global: true}, 'browserify-shim')
        .add('./src/d2.js')
        .bundle()
        .pipe(source('d2.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))

        //Do uglify etc here
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build'));
});

/**************************************************************************************************
 * Utility functions
 */

function runKarma(watch) {
    var karma = require('gulp-karma');
    var config = {
        configFile: 'test/karma.conf.js'
    };

    if (!watch) {
        watch = false;
    }

    if (watch === true) {
        config.action = 'watch';
    }

    return karma(config);
}