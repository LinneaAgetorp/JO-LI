const path                  = require('path');
const CleanWebpackPlugin    = require('clean-webpack-plugin');

module.exports = {
    devtool: 'inline-source-map',

    entry: './src/index.js',

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/build'),

        publicPath: 'build'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    'eslint-loader'
                ]
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules=true&localIdentName=[name]__[local]___[hash:base64:5]'
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.css']
    },

    plugins: [
        new CleanWebpackPlugin(['public/build'])
    ],

    devServer: {
        port: 3000,
        contentBase: './public',
        compress: true,
        historyApiFallback: true
    }
};