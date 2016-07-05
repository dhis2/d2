const webpack = require('webpack');
const WrapperPlugin = require('wrapper-webpack-plugin');

module.exports = {
    entry: './src/d2.js',
    output: {
        path: __dirname + '/lib',
        filename: 'd2-browser.js',
        library: 'd2',
        libraryTarget: 'var',
    },
    plugins: [
        // Export the default part of the d2 module.
        new WrapperPlugin({
            header: `var d2 = (function () {`,
            footer: `
                    return d2.default;
                })();
            `,
        }),

        new webpack.optimize.DedupePlugin(),
    ],
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: function (path) {
                    return !/(d2\/src)/.test(path);
                },
                loader: 'babel',
            },
        ],
    },
    devtool: 'source-map',
};
