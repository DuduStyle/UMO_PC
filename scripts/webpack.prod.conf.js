const path = require('path');
const webpack = require("webpack");
const merge = require("webpack-merge");
// 清除目录等
const cleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const webpackConfigBase = require('./webpack.base.conf');
const webpackConfigProd = {
    mode: 'production', // 通过 mode 声明生产环境
    output: {
		path: path.resolve(__dirname, '../dist'),
		// 打包多出口文件
		filename: './js/[name].[hash].js',
		publicPath: './'
    },
    devtool: 'cheap-module-eval-source-map',
    plugin: [
        new cleanWebpackPlugin(['dist'], {
			root: path.resolve(__dirname, '../'), //根目录
			// verbose Write logs to console.
			verbose: true, //开启在控制台输出信息
			// dry Use boolean "true" to test/emulate delete. (will not remove files).
			// Default: false - remove files
			dry: false,
        }),
        new UglifyJSPlugin({
			uglifyOptions: {
				compress: {
					warnings: false,
					drop_debugger: false,
					drop_console: true
				}
			}
		})
    ]
}
module.exports = merge(webpackConfigBase, webpackConfigProd);