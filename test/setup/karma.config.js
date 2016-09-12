var path = require('path');

module.exports = function karmaConfigHandler(config) {
    config.set({
        browsers: ['PhantomJS'], // run in Headless browser PhantomJS
        singleRun: true,
        frameworks: [
            'mocha', // Test runner
            'chai',  // Assertion library
            'sinon', // Mocking library
            'chai-sinon', // Assertions for mocks and spies
        ],
        files: [
            '../../node_modules/phantomjs-polyfill/bind-polyfill.js', // Adds Function.prototype.bind that is missing from phantomjs
            '../../node_modules/babel-core/browser-polyfill.js',
            '../../node_modules/whatwg-fetch/fetch.js',
            '../fixtures/e2efixtures.js',
            './tests.webpack.js', // just load this file as entry for webpack
        ],
        preprocessors: {
            'tests.webpack.js': ['webpack'], // preprocess with webpack and our sourcemap loader
        },
        reporters: ['spec', 'coverage'], // report results in this format
        coverageReporter: {
            type: 'lcov',
            dir: '../../coverage',
            subdir: function simplifyBrowsername(browser) {
                // normalization process to keep a consistent browser name accross different OS
                return browser.toLowerCase().split(/[ /-]/)[0];
            },
        },
        webpack: { // kind of a copy of your webpack config
            devtool: 'inline-source-map', // just do inline source maps instead of the default
            module: {
                preLoaders: [
                    // instrument only testing sources with Istanbul
                    {
                        test: /\.js$/,
                        include: path.resolve('../../src/'),
                        loader: 'istanbul-instrumenter',
                    },
                    // transpile all files except testing sources with babel as usual
                    {
                        test: /\.js$/,
                        exclude: [
                            path.resolve('src'),
                            path.resolve('node_modules'),
                        ],
                        loader: 'babel',
                        query: {
                            stage: 2,
                        },
                    },
                    // transpile and instrument only testing sources with isparta
                    {
                        test: /\.js$/,
                        include: path.resolve('src'),
                        loader: 'isparta',
                    },
                ],
            },
        },

        webpackServer: {
            noInfo: true, // please don't spam the console when running in karma!
        },
    });
};
