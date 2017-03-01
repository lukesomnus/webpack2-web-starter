const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const DashboardPlugin = require('webpack-dashboard/plugin');
const path = require('path');
const commonConfig = require('./webpack.base.js');

module.exports = function (env) {
    return webpackMerge(commonConfig(), {
        output: {
            filename: '[name].js',
        },
        // hotload
        devServer: {
            contentBase: path.resolve(__dirname, '../dist'),
            // compress:true,
            port: 3333,
        },
        plugins: [
            new webpack.DefinePlugin({
                dev: JSON.parse(true)
            }),
            new DashboardPlugin(),

            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin(),
        ]
    })
}