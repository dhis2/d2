module.exports = function( config ) {
    config.set({
        basePath: '../src',
        frameworks: ['jasmine', 'browserify'],

        preprocessors: {
            '../src/**/*.html': 'html2js',
            '../src/**/*.js': ['coverage', 'browserify'],
            '../test/**/*.js': ['browserify']
        },

        reporters: ['progress', 'coverage'],

        coverageReporter: {
            type: 'lcov',
            dir: '../coverage',
            subdir: function(browser) {
                // normalization process to keep a consistent browser name accross different OS
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
