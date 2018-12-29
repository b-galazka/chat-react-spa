const path = require('path');
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
                loader: 'babel-loader',
                options: {
                    forceEnv: 'production'
                }
            },

            {
                test: /\.scss$/,
                use: extractCSS.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                modules: true,
                                localIdentName: '[hash:base64:5]'
                            }
                        },
                        'postcss-loader',
                        { loader: 'sass-loader', options: { includePaths: ['./src/scss'] } }
                    ]
                })
            }
        ]
    },

    plugins: [
        extractCSS
    ],

    resolve: {
        extensions: ['.js', '.json', '.jsx'],
        alias: {
            '@src': path.resolve(__dirname, './src'),
            '@appComponent': path.resolve(__dirname, './src/components/app')
        }
    }
};