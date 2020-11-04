const path = require('path')

module.exports = {
    entry: './src/d2.js',
    output: {
        path: path.join(__dirname, 'lib'),
        filename: 'd2-browser.js',
        library: 'd2',
        libraryTarget: 'umd',
    },
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
}
