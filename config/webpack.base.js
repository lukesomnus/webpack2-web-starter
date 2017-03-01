//使用这个插件将不会将css代码打包到js中，这样就可以使用link导入
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
console.log(path.resolve(__dirname,'../html'))
module.exports = function () {
    return {
        entry: {
            app: './index.js',
            vendor: 'moment'
        },
        output: {
            path: path.resolve(__dirname, '../dist'),
            filename: '[chunkhash].[name].js',
        },
        resolve: {
            modules: [path.resolve(__dirname,'../'), 'node_modules'],
            // alias:{
            //     html:path.resolve(__dirname,'../html')
            // }
            // extensions: ['.js', '.json',]
        },
        module: {
            rules: [{
                    test: /\.js$/,
                    use: [{
                        loader: 'babel-loader?sourceMap',
                        options: {
                            presets: ['es2015']
                        }
                    }],
                    exclude: [/\.(spec|e2e|test)\.js$/]
                },
                {
                    test: /\.css$/,
                    // include: [path.resolve(__dirname, "./styles"), /node_modules/],
                    use: ExtractTextPlugin.extract([ "css-loader"])
                },
                {
                    test: /\.(sass|scss)$/,
                    // exclude: [path.resolve(__dirname, "./styles"), /node_modules/],
                    loader: [
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.(pug|jade)$/,
                    loader: 'pug-loader'
                },
                {
                    // img.src = require('./test.png');  返回的是图片的地址
                    test: /\.(png|jpg)$/,
                    loader: 'url-loader?limit=8192' // 内联的base64的图片地址，图片要小于8k，直接的url的地址则不解析
                },
                {
                    test: /\.html$/,
                    // include: [path.resolve(__dirname, "../html")],
                    loader: 'raw-loader'
                }
            ]
        },
        plugins: [
            new CopyWebpackPlugin([{
                from: './html/**/*.html',
                to: '[name].html'
            }, {
                from: './images/*'
            }]),
            new ExtractTextPlugin({
                // allChunks: true,
                // disable: false,
                filename: 'bundle.css'
            }),

            new htmlWebpackPlugin({
                template: './index.html',
                title: 'index page',
                filename: 'index.html',
                // favicon:'./src/images/favicon.png',
                chunks: ['app', 'vendor', 'manifest']
            }),

            // 提取所有公共模块
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor', 'manifest'] //指定公共bundle的名字，提取出manifest.js，避免vendor的hash变化
            }),
        ],
        // 用于隐藏当js包大于250kb时，不断的提示
        performance: {
            hints: false
        }
    }
}