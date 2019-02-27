const path = require('path');
const WrapperPlugin = require('wrapper-webpack-plugin');

module.exports = {
    entry: './src/d2.js',
    output: {
        path: path.join(__dirname, 'lib'),
        filename: 'd2-browser.js',
        library: 'd2',
        libraryTarget: 'var',
    },
    plugins: [
        // Assign the default export to the global `d2` var
        new WrapperPlugin({
            header: 'var d2 = (function () {',
            footer: 'return d2.default;})();',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    devtool: 'source-map',
};
