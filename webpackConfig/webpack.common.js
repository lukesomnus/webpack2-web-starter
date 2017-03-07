const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
    app: path.resolve(__dirname, '../app'),
    build: path.resolve(__dirname, '../build'),
};

module.exports = function () {
    return {
        entry: {
            app: PATHS.app
        },
        output: {
            path: PATHS.build,
            filename: '[name].js'
        },

        plugins: [
            new HtmlWebpackPlugin({
                title: 'Webpack demo'
            })
        ]
    }
}