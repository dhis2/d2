var webpack = require('webpack');
var path = require('path');

module.exports = {
    context: __dirname,
    entry: './app/d2-docs-app.js',
    devtool: 'source-map',
    output: {
        path: __dirname + '/dist',
        filename: 'd2-docs-app.js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    stage: 2,
                },
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader",
            },
            {
                test: /\.scss$/,
                loader: "style!css!sass",
            },
        ],
    },
    resolve: {
        alias: {
            //react: path.resolve('./node_modules/react'),
            //'material-ui': path.resolve('./node_modules/material-ui'),
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
/*
        new webpack.DefinePlugin({
            NODE_ENV: 'production',
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            sourceMap: true,
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
*/
    ],
    devServer: {
        contentBase: './app/',
        progress: true,
        colors: true,
        port: 8081,
        inline: true,
    },
};
