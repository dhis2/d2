module.exports = function( config ) {
    //const babelOptions = manifest.babelBoilerplateOptions;

    config.set({
        basePath: '..',
        frameworks: ['mocha', 'chai', 'sinon-chai', 'sinon'],

        preprocessors: {
            './src/**/*.js': ['babel']
        },

        reporters: ['progress'],

        files: [
            './test/fixtures/e2efixtures.js',
            './node_modules/jquery/dist/jquery.js',
            './jspm_packages/es6-module-loader.js',
            './jspm_packages/system.js',

            './test/e2e/**/*_spec.js',
            './config.js',
            { pattern: './src/**/*.js', included: false, served: true }
        ],

        'babelPreprocessor': {
            options: {
                modules: 'system',
                sourceMap: 'inline'
            },
            filename: function(file) {
                return file.originalPath.replace(/\.js$/, ".js");
            },
            sourceFileName: function(file) {
                return file.originalPath;
            }
        },

        //coverageReporter: {
        //    type: 'lcov',
        //    dir: '../coverage',
        //    subdir: function(browser) {
        //        // normalization process to keep a consistent browser name across different OS
        //        return browser.toLowerCase().split(/[ /-]/)[0];
        //    },
        //    // configure the reporter to use isparta for JavaScript coverage
        //    // Only on { "karma-coverage": "douglasduteil/karma-coverage#next" }
        //    instrumenters: { isparta : require('isparta') },
        //    instrumenter: {
        //        '**/*.js': 'isparta'
        //    },
        //    instrumenterOptions: {
        //        isparta: { babel : {
        //            sourceMap: 'inline',
        //            modules: 'system'
        //        } }
        //    }
        //},

        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,

        autoWatch: true,
        autoWatchBatchDelay: 100,
        usePolling: true,

        browsers: ['PhantomJS'],
        singleRun: true
    });
};
