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
                transpiler: 'babel',

                "paths": {
                    "*": "*.js",
                    "./src/d2/*": "./src/*.js"
                },

                map: {
                    'd2': './src/d2'
                }
            },

            files: [
                //D2 source files
                'src/**/*.js',

                //Test files
                'test/e2e/**/*_spec.js'
            ]
        },

        logLevel: config.LOG_INFO,

        browsers: ['PhantomJS'],
        singleRun: true
    });
};
