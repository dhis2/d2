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

gulp.task('test', function () {
    var jasmine = require('gulp-jasmine');

    return gulp.src(files)
        .pipe(jasmine());
});

gulp.task('watch', function () {
    var jasmine = require('gulp-jasmine');

    return gulp.watch([
        'src/**/*.js',
        'test/**/*.js'
    ], ['test']);

    //return gulp.src(files).pipe(runKarma(true));
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