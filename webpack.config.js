const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const dev = require('./webpack/dev.js');
const prod = require('./webpack/prod.js');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = (env, options) => {
    console.log(`This is the Webpack 4 'mode': ${options.mode}`);
    let conf = {};
    switch (options.mode) {
        case 'production':
            conf = prod;
            break;
        case 'development':
            conf = dev;
            break;
        default:
            break;
    }
    return {
        entry: [
            './src/public/components/Notification/Notification.tmpl.js',
            './src/public/components/FileInput/FileInput.tmpl.js',
            './src/public/components/Profile/Profile.tmpl.js',
            './src/public/components/Menu/Menu.tmpl.js',
            './src/public/components/Header/Header.tmpl.js',
            './src/public/components/Button/Button.tmpl.js',
            './src/public/components/Input/Input.tmpl.js',
            './src/public/components/SignX/SignX.tmpl.js',
            './src/public/components/Score/Score.tmpl.js',
            './src/public/components/Singleplayer/Singleplayer.tmpl.js',
            './src/public/components/Canvas/Canvas.tmpl.js',
            './src/public/components/404NotFound/Error404.tmpl.js',
            './src/public/main.js'
        ],
        output: {
            path: path.resolve(__dirname, 'src/public'),
            filename: 'bundle.js'
        },
        watchOptions: {
            aggregateTimeout: 100
        },
        plugins: [
            new ExtractTextPlugin({ filename: 'bundle.css' }),
            new webpack.DefinePlugin(conf)
        ],
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
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract(
                        {
                            fallback: 'style-loader',
                            use: ['css-loader']
                        })
                },
                {
                    test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
                    use: 'url-loader?limit=100000'
                }
            ]
        }
    };
};

// module.exports = {
//     entry: [
//         './src/public/components/Notification/Notification.tmpl.js',
//         './src/public/components/FileInput/FileInput.tmpl.js',
//         './src/public/components/Profile/Profile.tmpl.js',
//         './src/public/components/Menu/Menu.tmpl.js',
//         './src/public/components/Header/Header.tmpl.js',
//         './src/public/components/Button/Button.tmpl.js',
//         './src/public/components/Input/Input.tmpl.js',
//         './src/public/components/SignX/SignX.tmpl.js',
//         './src/public/components/Score/Score.tmpl.js',
//         './src/public/components/Singleplayer/Singleplayer.tmpl.js',
//         './src/public/components/Canvas/Canvas.tmpl.js',
//         './src/public/components/404NotFound/Error404.tmpl.js',
//         './src/public/main.js'
//     ],
//     output: {
//         path: path.resolve(__dirname, 'src/public'),
//         filename: 'bundle.js'
//     },
//     watchOptions: {
//         aggregateTimeout: 100
//     },
//     plugins: [
//         new ExtractTextPlugin({ filename: 'bundle.css' })
//     ],
//     module: {
//         rules: [
//             {
//                 test: /\.js$/,
//                 exclude: /node_modules/,
//                 use: {
//                     loader: 'babel-loader'
//                 }
//             },
//             {
//                 test: /\.css$/,
//                 use: ExtractTextPlugin.extract(
//                     {
//                         fallback: 'style-loader',
//                         use: ['css-loader']
//                     })
//             },
//             {
//                 test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
//                 use: 'url-loader?limit=100000'
//             }
//         ]
//     }
// };
