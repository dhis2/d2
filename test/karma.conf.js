module.exports = function( config ) {
    config.set({
        basePath: '../src',
        frameworks: ['mocha', 'browserify', 'sinon'],

        preprocessors: {
            '../src/**/*.html': 'html2js',
            '../test/fixtures/**/*.js': ['browserify'],
            '../src/**/*.js': ['coverage', 'browserify']
        },

        reporters: ['progress', 'coverage'],

        coverageReporter: {
            type: 'lcov',
            dir: '../coverage',
            subdir: function(browser) {
                // normalization process to keep a consistent browser name across different OS
                return browser.toLowerCase().split(/[ /-]/)[0];
            }
        },

        browserify: {
            debug: true
        },

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
