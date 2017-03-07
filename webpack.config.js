const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// 去除不需要的css
const PurifyCSSPlugin = require('purifycss-webpack');

const cssnano = require('cssnano');


const path = require('path');
const glob = require('glob');

console.log(path.resolve(__dirname,'app/images/'));

const PATHS = {
    app: path.resolve(__dirname, 'app/js'),
    build: path.resolve(__dirname, 'build'),
};


function commonConfig() {
    return {
        entry: {
            // app:['babel-polyfill',PATHS.app], 如果想使用promise等es6对象
            app: PATHS.app,
            test: PATHS.app,
        },

        output: {
            path: PATHS.build,
            filename: '[name].js',
        },
        resolve:{
            // 要搜索的目录，前面的优先于后面的
            // modules: [path.resolve(__dirname, 'app'), 'node_modules'],
            // 路径的别名
            alias:{
                // sds:path.resolve(__dirname,'app/images/'),
                styles:path.resolve(__dirname,'app/styles/'),
                js:path.resolve(__dirname,'app/js/'),
            },
        },
        module: {
            rules: [{
                test: /\.js$/,
                include: PATHS.app,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: ['es2015'],
                },
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash:8].[ext]',
                    },
                },
            },
            {
                test: /\.html$/,
                loader: 'raw-loader',
            },
            ],
        },

        plugins: [
            new HtmlWebpackPlugin({
                title: 'Webpack demo',
                // chunks: ['vendor', 'app'],
                template: './app/index.html',
            }),
        ],
    };
}


function developmentConfig() {
    return webpackMerge(commonConfig(), {
        output: {
            devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
        },
        module: {
            rules: [{
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }, {
                // 将以下资源转成Base64编码，保存在js文件中，这样减少了图片的请求
                test: /\.(jpg|png|svg)$/,
                loader: 'url-loader',
                options: {
                    name: '[name].[ext]',
                },
            }],
        },
        devServer: {
            port: 3333,
            // 启动服务的时候自动开启浏览器
            // open: true,
            historyApiFallback: true,
            // 控制台只输出错误消息
            stats: 'errors-only',
            overlay: {
                errors: true,
                warnings: true,
            },
            // hotOnly: true,
            hot: true,
            watchOptions: {
                // Delay the rebuild after the first change
                aggregateTimeout: 300,

                // Poll using interval (in ms, accepts boolean too)
                poll: 1000,
            },
            contentBase: ['images'],
        },
        devtool: 'cheap-module-eval-source-map',
        plugins: [
            new webpack.HotModuleReplacementPlugin(),

            // 在控制台可以看到那个module更新了
            new webpack.NamedModulesPlugin(),

            // Ignore node_modules so CPU usage with poll
            // watching drops significantly.
            new webpack.WatchIgnorePlugin([
                path.join(__dirname, 'node_modules'),
            ]),
        ],
    });
}

function productionConfig() {
    return webpackMerge(commonConfig(), {
        entry: {
            // vendor: ['jquery', 'react'],
        },
        output: {
            chunkFilename: './js/[name].[chunkhash:8].js',
            filename: './js/[name].[chunkhash:8].js',
        },
        module: {
            rules: [{
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => ([require('autoprefixer')]),
                        },
                    }],
                    // 解决css url()的路径问题
                    publicPath:'../',
                    fallback: 'style-loader',
                }),
            }, {
                // 将以下资源转成Base64编码，保存在js文件中，这样减少了图片的请求
                test: /\.(jpg|png|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 25000, //限制不能超过25kb,超过后会调用file-loader
                    name: './images/[name].[hash:8].[ext]',
                },
            }],
        },
        plugins: [

            // 删除文件
            new CleanWebpackPlugin([PATHS.build]),

            // new webpack.DefinePlugin({
            //     'process.env.NODE_ENV': 'production',
            // }),

            // 提取entry中公共的库js代码
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                // 从app.js中抽离与vendor中重复的代码
                // 不写chunks,默认将所有entry里的公共js提取出来，vendor一般不会有太多变化
                miniChunks: isVendor,
            }),

            // 单独抽离

            // new webpack.optimize.CommonsChunkPlugin({
            //     name: 'test.vendor',
            //     chunks: ['test'],
            //     miniChunks: isVendor,
            // }),

            // 抽离公共模块
            // new webpack.optimize.CommonsChunkPlugin({
            //     name: 'common',
            //     // 抽离app与tes文件中自己写的代码的公共的部分，不是引用的库的公共部分
            //     chunks: ['app', 'test'],
            //     // module引用的模块，count引用的次数
            //     minChunks: (module, count) => {
            //         return count >= 2 && isVendor(module);
            //     },
            // }),

            // 生成一个js加载的清单，如果vendors文件没有变化，不改变它的hash值，这样可以利用浏览器的cache,manifest文件的hash值也不会有变化
            new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest',
                // 从app.js中抽离与vendor中重复的代码
                // chunks: ['app','test'],
                miniChunks: Infinity,
            }),


            // js代码压缩，不适用uglify的原因是，uglify不支持es6,压缩会出现问题
            new BabiliPlugin(),

            new ExtractTextPlugin({
                filename: './styles/[name].[contenthash:8].css',
                // 所有entry如果生成的css文件合并成一个
                allChunks:true,
            }),

            new webpack.HashedModuleIdsPlugin(),

            new PurifyCSSPlugin({
                paths: glob.sync(path.join(PATHS.app, '**', '*')),
                // options: {
                //     minify: true,
                // },
            }),

            // css压缩
            new OptimizeCSSAssetsPlugin({
                cssProcessor: cssnano,
                cssProcessorOptions: {
                    discardComments: {
                        removeAll: true,
                    },
                    // Run cssnano in safe mode to avoid
                    // potentially unsafe transformations.
                    safe: true,
                },
            }),

            // 图片压缩
            new ImageminPlugin({
                disable: process.env.NODE_ENV !== 'production', // Disable during development 
                pngquant: {
                    quality: '95-100',
                },
            }),
        ],
        // recordsPath: 'records.json',

        // performance: {
        //     hints: 'warning', // 'error' or false are valid too
        //     maxEntrypointSize: 100000, // in bytes
        //     maxAssetSize: 450000, // in bytes
        // },
    });
}

function extractBundles(bundles) {
    return {
        plugin: bundles.map(bundle =>
            new webpack.optimize.CommonsChunkPlugin(bundle)
        ),
    };
}

// 判断是不是加载来自nodnode_modules里的文件
function isVendor({
    resource,
}) {
    return resource &&
        resource.indexOf('node_modules') >= 0 &&
        resource.match(/\.js$/);
}

function buildConfig(env) {

    process.env.BABEL_ENV = env;

    if (env === 'prod') {
        return productionConfig();
    }
    return developmentConfig();
}
module.exports = buildConfig;