
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const dev = require('./webpack/dev.js');
const prod = require('./webpack/prod.js');

module.exports = (env, options) => {
    console.log(`This is the Webpack 4 'mode': ${options.mode}`);
    let conf = {};
    let devtool;
    switch (options.mode) {
        case 'production':
            conf = prod;
            devtool = '';
            break;
        case 'development':
            conf = dev;
            devtool = 'cheap-module-source-map';
            break;
        default:
            break;
    }
    return {
        entry: './src/public/main.js',
        output: {
            path: path.resolve(__dirname, 'src/public/build'),
            filename: 'bundle.js'
        },
        devtool,
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract(
                        {
                            fallback: 'style-loader',
                            use: ['css-loader', 'postcss-loader', 'sass-loader']
                        })
                },
                {
                    test: /\.tmpl\.xml$/,
                    use: [
                        {
                            loader: 'fest-webpack-loader'
                        }
                    ]
                },
                {
                    test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
                    use: 'url-loader?limit=100000'
                }
            ]
        },
        plugins: [
            new ServiceWorkerWebpackPlugin({
                entry: path.resolve(__dirname, 'src/public/sw.js')
            }),
            new ExtractTextPlugin({ filename: 'bundle.css' }),
            new webpack.DefinePlugin(conf)
        ]
    };
};
