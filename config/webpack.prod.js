const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const commonConfig = require('./webpack.base.js');

module.exports = function (env) {
    return webpackMerge(commonConfig(), {
        plugins: [
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            }),
            new webpack.DefinePlugin({
                prod: JSON.stringify(true)
            }),
            // 压缩
            new webpack.optimize.UglifyJsPlugin(),
            
        ]
    })
}