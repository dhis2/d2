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

gulp.task('test', function (cb) {
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

gulp.task('watch', function () {
    return gulp.watch([
        'src/**/*.js',
        'test/**/*.js'
    ], ['test']);
});

gulp.task('jshint', function () {
    var jshint = require('gulp-jshint');
    return gulp.src([
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
        'test/specs/**/*.js',
        'src/**/*.js'
    ]).pipe(jscs('./.jscsrc'));
});

gulp.task('clean', function () {
    del(buildDirectory);
});

gulp.task('travis', function () {
    return runSequence('test', 'jshint', 'jscs');
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