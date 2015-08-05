var webpack = require('webpack');

module.exports = {
    entry: "./src/d2.js",
    output: {
        path: __dirname + '/dist',
        filename: "d2-browser.js",
        libraryTarget: 'var'
    },
    plugins: [
        new webpack.optimize.DedupePlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: function (path) {
                    return !/(d2\/src)/.test(path);
                },
                loader: 'babel'
            }
        ]
    },
    devtool: 'source-map'
};
