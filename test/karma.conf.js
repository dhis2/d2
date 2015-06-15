module.exports = function( config ) {
    config.set({
        basePath: '..',
        //Frameworks to use with karma
        frameworks: ['mocha', 'chai', 'sinon-chai', 'sinon', 'systemjs'],

        //How will the results of the tests be reported
        reporters: ['mocha'],

        //Files that should be included by karma (that are not served by karma-systemjs)
        files: [
            //Babel polyfill to polyfill es6 features
            './node_modules/babel/node_modules/babel-core/browser-polyfill.js',

            //Include jquery in a regular fashion.
            './jspm_packages/github/components/jquery**/jquery.js',

            //Api fixtures to represent the server
            './test/fixtures/e2efixtures.js'
        ],

        //Config for karma-systemjs
        systemjs: {
            config: {
                baseURL: '/',
                "defaultJSExtensions": true,
                transpiler: 'babel',
                "babelOptions": {
                    "optional": [
                        "runtime"
                    ]
                },

                paths: {
                    'd2:*': '/base/src/*',
                    'd2:d2/*': '/base/src/*',
                    "github:*": "jspm_packages/github/*",
                    "npm:*": "jspm_packages/npm/*"
                },

                map: {
                    'd2': 'd2:d2',
                    "babel-runtime": "npm:babel-runtime@5.5.8",
                    "core-js": "npm:core-js@0.9.17",
                    "process": "npm:process@0.10.1"
                }
            },

            files: [
                //D2 source files
                'src/**/*.js',
                'jspm_packages/**/*.js',

                //Test files
                'test/e2e/**/*_spec.js'
            ]
        },

        logLevel: config.LOG_INFO,

        browsers: ['PhantomJS'],
        singleRun: true
    });
};
