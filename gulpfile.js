var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var $ = require('gulp-load-plugins')();

const buildDirectory = 'build';
const coverageDirectory = 'coverage';
const manifest = require('./package.json');
const config = manifest.babelBoilerplateOptions;

/**
 * Files that are used for running the unit test and code coverage tasks
 * These files are passed into mocha
 */
var files = [
    //Do some setup tasks
    'test/setup/node.js',

    //Fixtures that contain data/objects to use for unit tests
    'test/fixtures/fixtures.js',

    //Unit test specs
    'test/unit/**/*_spec.js'
];

/**
 * Run code coverage for the unit tests
 */
gulp.task('coverage', function () {
    return runUnitTestsWithCoverage();
});

/**
 * Run the unit tests
 */
gulp.task('test', function () {
    return runUnitTests();
});

/**
 * Watch the files defined in `files` and run the unit tests when a change was detected
 */
gulp.task('watch', function() {
    return gulp.watch(files, ['test']);
});

/**
 * Run e2e tests using karma test runner
 */
gulp.task('e2e', function () {
    return gulp.src([]).pipe(runKarma());
});

/**
 * Watch for the changes to files and run the e2e tests
 */
gulp.task('e2e-watch', function () {
    return gulp.src([]).pipe(runKarma(true));
});

/**
 * Lint the code for errors
 */
gulp.task('jshint', function () {
    return gulp.src([
            'test/e2e/**/*.js',
            'test/unit/**/*.js',
            'src/**/*.js'
        ])
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

/**
 * Check code style using jscs
 */
gulp.task('jscs', function () {
    return gulp.src([
        'test/e2e/**/*.js',
        'test/unit/**/*.js',
        'src/**/*.js'
    ]).pipe($.jscs('./.jscsrc'));
});

/**
 * Clean up the build directory and coverage directory
 */
gulp.task('clean', function () {
    del(buildDirectory);
    del(coverageDirectory);
});

/**
 * Task to be run by travis. This runs coverage which runs the unit tests. Then additionally it runs the e2e tests and
 * the lint and code style checks
 */
gulp.task('travis', function () {
    return runSequence('coverage', 'e2e', 'jshint', 'jscs');
});


gulp.task('build', ['clean'], function () {
    //TODO: Create a build that includes all the system.js functions
});

/**************************************************************************************************
 * Utility functions
 */

function runKarma(watch) {
    var config = {
        configFile: 'test/karma.conf.js'
    };

    if (!watch) {
        watch = false;
    }

    if (watch === true) {
        config.action = 'watch';
    }

    return $.karma(config);
}

function runUnitTests() {
    require('babel/register')();

    return gulp.src(files, {read: false})
        .pipe($.plumber())
        .pipe($.mocha({
            reporter: 'spec',
            globals: config.mochaGlobals,
        }));
}

/**
 * Uses gulp-spawn-mocha so we can pass a compilers flag and do coverage commands.
 *
 * The
 */
function runUnitTestsWithCoverage() {
    return gulp.src(files, {read: false})
        .pipe($.plumber())
        .pipe($.spawnMocha({
            reporter: 'spec',
            globals: config.mochaGlobals,
            compilers: 'js:babel/register',
            istanbul: true
        }));
}