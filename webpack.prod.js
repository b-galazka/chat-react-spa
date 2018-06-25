const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('../css/style.css');

module.exports = {

    entry: [
        'raf',
        'babel-polyfill',
        path.resolve(__dirname, 'src/index.jsx')
    ],

    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'app.js',
        publicPath: '/dist/'
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, 'src'),
                loader: 'babel-loader'
            },

            {
                test: /\.scss$/,
                use: extractCSS.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { importLoaders: 1 } },
                        'postcss-loader',
                        'sass-loader'
                    ]
                })
            }
        ]
    },

    plugins: [
        extractCSS
    ],

    resolve: {
        extensions: ['.js', '.json', '.jsx']
    }
};