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
    return gulp.watch(files.concat(['src/**/*.js']), ['test']);
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
    ])
    .pipe($.jscs('./.jscsrc'));

    //TODO: Not yet implemented in jscs but should be there soon(tm)
    // .pipe($.jscs.reporter('jscs-stylish'))
    // .pipe($.jscs.reporter('fail'));
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
gulp.task('travis', function (cb) {
    runSequence('coverage', 'jshint', 'jscs', cb);
});

gulp.task('git:pre-commit', function (cb) {
    gulp.on('err', function(e){
        console.log('Pre-commit validate failed');
        process.exit(1);
    });

    runSequence('test', 'jshint', 'jscs', cb);
});

gulp.task('build', ['clean'], function (cb) {
    var Builder = require('systemjs-builder');

    var sfxBuildDone = false;
    var buildDone = false;
    var callDone = function () {if (sfxBuildDone && buildDone) cb()};

    var builder = new Builder({});
    builder.loadConfig('./config.js')
        .then(function () {
            builder.config({baseURL: './src'});

            builder.buildSFX('d2', 'build/d2-sfx.js')
                .then(function() {
                    console.log('Build complete');
                    sfxBuildDone = true;
                    callDone();
                });

            builder.build('d2', 'build/d2.js')
                .then(function () {
                    console.log('Building systemjs library complete');
                    buildDone = true;
                    callDone();
                });
        });
});

/**************************************************************************************************
 * Documentation
 */
var Dgeni = require('dgeni');
var configPackage = require('./docs/config');

gulp.task('clean-docs', function (cb) {
    del(['./docs/dist/*/**', './docs/dist/*.html'], cb);
});

gulp.task('docs', ['clean-docs'], function (cb) {
    var packages = [configPackage];
    var dgeni = new Dgeni(packages);

    dgeni.generate().then(function(docs) {
        gulp.src(['./docs/app/**']).pipe(gulp.dest('./docs/dist')).pipe(cb);
        console.log(docs.length, 'docs generated');
    });
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
            reporter: 'dot',
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
            reporter: 'dot',
            globals: config.mochaGlobals,
            compilers: 'js:babel/register',
            istanbul: true
        }));
}
