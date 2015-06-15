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
gulp.task('watch', function () {
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

gulp.task('build', ['clean'], function (cb) {
    var Builder = require('systemjs-builder');
    var builder = new Builder({});

    var sharedConfig = {
        baseURL: './src',
        transpiler: 'babel',
        paths: {
            "*": "*.js",
            'd2/*': './src/*.js',
            "github:*": "./jspm_packages/github/*.js",
            "npm:*": "./jspm_packages/npm/*.js"
        },
        "map": {
            "babel": "npm:babel-core@5.5.8",
            "babel-runtime": "npm:babel-runtime@5.5.8",
            "core-js": "npm:core-js@0.9.17",
            "jquery": "github:components/jquery@2.1.3",
            "process": "github:jspm/nodelibs-process@0.1.1",
            "github:jspm/nodelibs-process@0.1.1": {
                "process": "npm:process@0.10.1"
            },
            "npm:babel-runtime@5.5.8": {
                "process": "github:jspm/nodelibs-process@0.1.1"
            },
            "npm:core-js@0.9.17": {
                "fs": "github:jspm/nodelibs-fs@0.1.2",
                "process": "github:jspm/nodelibs-process@0.1.1",
                "systemjs-json": "github:systemjs/plugin-json@0.1.0"
            }
        }
    };

    builder.config({
        baseURL: sharedConfig.baseURL,
        transpiler: sharedConfig.transpiler,
        paths: sharedConfig.paths,
        map: sharedConfig.map,
        meta: {
            'github:jspm/nodelibs-process@*': {
                build: false,
            },
            'npm:process@*/browser': {
                build: false
            },
            'npm:babel-runtime@*/core-js': {
                build: false
            },
            'npm:babel-runtime@*/helpers/class-call-check': {
                build: false
            },
            'npm:babel-runtime@*/helpers/create-class': {
                build: false
            },
            babel: {
                build: false
            }
        }
    });

    builder.build('d2', 'build/d2.js', {minify: false, mangle: false, sourceMaps: true})
        .then(function () {
            console.log('Building systemjs bundle complete');
        })
        .then(function () {
            var builder = new Builder({});
            builder.config({
                baseURL: sharedConfig.baseURL,
                transpiler: sharedConfig.transpiler,
                "babelOptions": {
                    "optional": [
                        "runtime"
                    ]
                },
                paths: sharedConfig.paths,
                map: sharedConfig.map
            });

            return builder.buildSFX('d2', 'build/d2-sfx.js', {minify: true, mangle: false, sourceMaps: true})
                .then(function () {
                    console.log('Building systemjs sfx bundle complete')
                });
        })
        .then(cb)
        .catch(function (error) {
            console.log(error);
        });
});

/**************************************************************************************************
 * Continuous Integration
 */
/**
 * Task to be run by travis. This runs coverage which runs the unit tests. Then additionally it runs the e2e tests and
 * the lint and code style checks
 */
gulp.task('ci:travis', function (cb) {
    runSequence('coverage', 'e2e', 'jshint', 'jscs', cb);
});

/**************************************************************************************************
 * Git Hooks
 */
gulp.task('git:pre-commit', function (cb) {
    //Gulp exists with 0 and for the pre-commit hook to fail we need to exit with a not 0 error code
    gulp.on('err', function (e) {
        console.log('Pre-commit validate failed');
        process.exit(1);
    });

    runSequence('test', 'jshint', 'jscs', cb);
});

/**************************************************************************************************
 * Documentation
 */
var Dgeni = require('dgeni');
var configPackage = require('./docs/config');

gulp.task('docs:clean', function (cb) {
    del(['./docs/dist/**/*', './docs/dist/*'], cb);
});

gulp.task('docs:dgeni', function (cb) {
    var packages = [configPackage];
    var dgeni = new Dgeni(packages);

    dgeni.generate().then(function (docs) {
        cb();
    });
});

gulp.task('docs:build', function (cb) {
    runSequence('docs:clean', 'docs:dgeni', 'docs:d2-build', 'docs:app', cb);
});

gulp.task('docs:app', function (cb) {
    var Builder = require('systemjs-builder');
    var builder = new Builder({});

    builder.loadConfig('./docs/app/config.js')
        .then(function () {
            builder.config({baseURL: 'file:./docs/app'});
            builder.build('app', './docs/dist/app-bundle.js', {minify: true, mangle: false, sourceMaps: true})
                .then(function () {
                    gulp.src([
                        './docs/app/*.{html,css}',
                        './docs/app/**/system.js',
                        './docs/app/**/es6-module-loader.js',
                        './docs/app/**/npm/d2-code-example-runner@*/**',
                        './docs/app/**/babel-core@*/**',
                        './docs/app/config.js'
                    ], {baseUrl: './docs/app'})
                    .pipe(gulp.dest('./docs/dist'))
                    .pipe(cb);
                })
                .catch(function (err) {
                    console.log('Building docs:app failed');
                    console.error(err);
                });
        });
});

gulp.task('docs:d2-build', ['build'], function () {
    return gulp.src(['./build/**'], {baseUrl: './build'}).pipe(gulp.dest('./docs/dist/'));
});

/**************************************************************************************************
 * Npm Publish hooks
 */
(function () {
    var filesToPublish = [
        'd2.js',
        'd2.js.map',
        'd2-sfx.js',
        'd2-sfx.js.map'
    ];

    gulp.task('publish:pre', function () {
        var filesToCopyFromBuildDir = filesToPublish.map(function (fileName) {
            return './build/' + fileName;
        });

        return gulp.src(filesToCopyFromBuildDir, {baseUrl: './build'}).pipe(gulp.dest('./'));
    });

    gulp.task('publish:post', function (cb) {
        del(filesToPublish, cb);
    });
})();

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

/**
 * Simple function to show a processing state and will print done when the action is done.
 *
 * @param {String} prefix Text to be printed before the status icon and 'done!'
 * @returns {*}
 */
function showProcessing(prefix) {
    showProcessing.busy = true;
    function processing() {
        switch (showProcessing.char) {
            case '|':
                showProcessing.char = '/';
                break;
            case '/':
                showProcessing.char = '-';
                break;
            case '-':
                showProcessing.char = '\\';
                break;
            case '\\':
                showProcessing.char = '|';
                break;
        }

        process.stdout.clearLine();  // clear current text
        process.stdout.cursorTo(0);  // move cursor to beginning of line

        if (showProcessing.busy) {
            process.stdout.write(prefix + ':  ' + showProcessing.char);
            return setTimeout(processing, 300);
        } else {
            console.log(prefix + ': done!');
            return true;
        }
    }

    return processing();
}
showProcessing.done = function () {
    showProcessing.busy = false;
}
showProcessing.busy = false;
showProcessing.char = '|';
