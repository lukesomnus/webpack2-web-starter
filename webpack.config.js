//使用这个插件将不会将css代码打包到js中，这样就可以使用link导入
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const NODE_ENV = process.env.NODE_ENV;

const ISPRODCUTION = NODE_ENV === 'production';
const ISDEV = NODE_ENV === 'development';
const definePlugin = new webpack.DefinePlugin({
    // PRODUCTION: JSON.stringify(ISPRODCUTION),
    ISDEV: JSON.stringify(ISDEV)
});
const config = {
    context: path.resolve(__dirname, './src'),
    entry: {
        // app: ["webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",'./app.js'], //app:['foo.js','bar.js','vendor.js']  // multiple files one output
        app: './index.js',
        time: './js/time.js',
        vendor:'moment'
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
        port: 3333,
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
            include:[path.resolve(__dirname, "./src/common/styles"),/node_modules/],
            // style-loader的作用是将css代码通过<style>标签嵌入到<head>中
            //css-loader 是遍历css,然后找到url()处理他
            loader: ExtractTextPlugin.extract('css-loader?sourceMap')
        },
        //  {
        //     test: /\.(sass|scss)$/,
        //     include:path.resolve(__dirname, "./src/common/styles"),
        //     loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: ['css-loader','sass-loader'] })
        // },
         {
            test: /\.(sass|scss)$/,
            exclude: [path.resolve(__dirname, "./src/common/styles"), /node_modules/],
            loader: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
        }, {
            test: /\.(pug|jade)$/,
            loader: 'pug-loader'
        }, {
            // img.src = require('./test.png');  返回的是图片的地址
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=8192' // 内联的base64的图片地址，图片要小于8k，直接的url的地址则不解析
        }, {
            test: /\.html$/,
            loader: 'raw-loader'
        }]
    },
    devtool: 'source-map',
    plugins: [
        definePlugin,
        new ExtractTextPlugin({
            allChunks: true,
            disable: false,
            filename: 'bundle.css'
        }),
        new htmlWebpackPlugin({
            template: './index.html',
            title: 'index page',
            filename: 'index.html',
            // favicon:'./src/images/favicon.png',
            chunks:['app','vendor','manifest']
        }),
        new CopyWebpackPlugin([{
                from: './html/**/*.html',
                to: '[name].html'
            },{
              from:'./images/*'
            }]
        ),
        new webpack.optimize.CommonsChunkPlugin({
          names:['vendor','manifest']
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
    ],
    // 用于隐藏当js包大于250kb时，不断的提示
    performance: { hints: false }
};
module.exports = config;
