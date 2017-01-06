//使用这个插件将不会将css代码打包到js中，这样就可以使用link导入
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const NODE_ENV = process.env.NODE_ENV;

const ISPRODCUTION = NODE_ENV ==='production';
const ISDEV = NODE_ENV ==='development';
const definePlugin = new webpack.DefinePlugin({
    // PRODUCTION: JSON.stringify(ISPRODCUTION),
    ISDEV: JSON.stringify(ISDEV)
});
const config = {
    context: path.resolve(__dirname, './src'),
    entry: {
        // app: ["webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",'./app.js'], //app:['foo.js','bar.js','vendor.js']  // multiple files one output
        // vendor:'moment'
        app: './app.js'
    },
    /*
    //multiple files , multiple outputs
    entry:{
    foo : './foo.js',
    bar : './bar.js',
    baz : './bar.js'
    }
    */
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
        publicPath: '/assets', //webpack output is served from /assets, Content not from webpack is served from /Users/Min/WebstormProjects/LearnDeom/webpack2/src
    },
    // hotload
    devServer: {
        contentBase: path.resolve(__dirname, './src'),
        // compress:true,
        port: 8080,
    },
    // avoiding loading error
    resolve: {
        modules: [path.resolve(__dirname, './src'), 'node_modules'],
        // you can now require('file') instead of require('file.coffee')
        extensions: ['.js', '.json']
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: [{
                loader: 'babel-loader?sourceMap',
                options: {
                    presets: ['es2015']
                }
            }]
        }, {
            test: /\.css$/,
            // style-loader的作用是将css代码通过<style>标签嵌入到<head>中
            //css-loader 是遍历css,然后找到url()处理他
            use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        modules: true
                    }
                }] //注意loader的顺序，style和css反了会报错
        }, {
            test: /\.(sass|scss)$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader',
            ]
        }, {
            test: /\.(pug|jade)$/,
            loader: 'pug-loader'
        }, {
            // img.src = require('./test.png');  返回的是图片的地址
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=8192' // 内联的base64的图片地址，图片要小于8k，直接的url的地址则不解析
        },{
          test:/\.html$/,
          loader: 'raw-loader'
        }]
    },
    devtool: 'source-map',
    plugins: [
        definePlugin,
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new htmlWebpackPlugin({
            template: './html/index.pug',
            title: 'luke lee',
            // favicon:'./src/images/favicon.png',
            // chunks:[]
        }),
    ]
};
module.exports = config;
