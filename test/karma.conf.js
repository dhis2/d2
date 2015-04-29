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
