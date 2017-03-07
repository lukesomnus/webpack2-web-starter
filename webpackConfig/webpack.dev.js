const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const commonConfig = require('./webpack.common');

module.exports = function (env) {
    return webpackMerge(commonConfig(), {
        devServer: {
            port: 3333,
            // 启动服务的时候自动开启浏览器
            open: true,
            historyApiFallback: true,
            // 控制台只输出错误消息
            stats: 'errors-only',
            overlay: {
                errors: true,
                warnings: true
            },
            // hotOnly: true,
            watchOptions: {
                // Delay the rebuild after the first change
                aggregateTimeout: 300,

                // Poll using interval (in ms, accepts boolean too)
                poll: 1000,
            }
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),

            // 在控制台可以看到那个module更新了
            new webpack.NamedModulesPlugin(),

            // Ignore node_modules so CPU usage with poll
            // watching drops significantly.
            new webpack.WatchIgnorePlugin([
                path.join(__dirname, 'node_modules')
            ]),
        ]
    });
}