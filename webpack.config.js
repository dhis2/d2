var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: './src/d2.js',
    output: {
        path: __dirname + '/lib',
        filename: 'd2-browser.js',
        libraryTarget: 'var',
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
    ],
    module: {
        loaders: [
            {
                test: /\.json$/,
                include: path.resolve(__dirname + '/src/model/config'),
                loader: 'json',
            },
            {
                test: /\.js?$/,
                exclude: function excludeTestBabelLoader(path) {
                    return !/(d2\/src)/.test(path);
                },
                loader: 'babel',
            },
        ],
    },
    devtool: 'source-map',
};
