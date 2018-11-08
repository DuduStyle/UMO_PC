const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
// html模板
const htmlWebpackPlugin = require("html-webpack-plugin");
//静态资源输出
const copyWebpackPlugin = require("copy-webpack-plugin");

// 获取html-webpack-plugin参数的方法
var getHtmlConfig = function (name, chunks) {
    console.log('getHtmlConfig', name, chunks)
	return {
		template: `./src/pages/${name}/index.html`,
		filename: `${name}.html`,
		favicon: './src/asserts/img/favicon.ico',
		// title: title,
		inject: true,
		hash: true, //开启hash  ?[hash]
		chunks: chunks,
		minify: process.env.NODE_ENV === "development" ? false : {
			removeComments: true, //移除HTML中的注释
			collapseWhitespace: true, //折叠空白区域 也就是压缩代码
			removeAttributeQuotes: true, //去除属性引用
		},
	};
};
function getEntry() {
    var entry = {};
    console.log('glob.sync', glob.sync('./src/pages/**/*.js'));
    //读取src目录所有page入口
    glob.sync('./src/pages/**/*.js')
        .forEach(function (name) {
            var start = name.indexOf('src/') + 4,
                end = name.length - 3;
            var eArr = [];
            var n = name.slice(start, end); // 结果是："pages/index/index"
            n = n.slice(0, n.lastIndexOf('/')); //结果是：保存各个组件的入口 "pages/index" 
            n = n.split('/')[1]; // 结果是：index
            eArr.push(name);
            entry[n] = eArr;// 结果是：{index:[ './src/pages/index/index.js' ]}
        });
        console.log('entry', entry);
    return entry;
};


module.exports = {
    entry: getEntry(),
    plugins: [
		// 全局暴露统一入口
		new webpack.ProvidePlugin({
		
		}),
		// //静态资源输出
		new copyWebpackPlugin([{
			from: path.resolve(__dirname, "../src/assets"),
			to: './assets',
			ignore: ['.*']
		}]),
		// // 消除冗余的css代码
		// new purifyCssWebpack({
		// 	paths: glob.sync(path.join(__dirname, "../src/pages/*/*.html"))
		// }),
	]
};
//配置页面
const entryObj = getEntry();
const htmlArray = [];
Object.keys(entryObj).forEach(element => {
	htmlArray.push({
		_html: element,
		title: '',
		chunks: ['vendor', 'common', element]
	})
})
//自动生成html模板
htmlArray.forEach((element) => {
	module.exports.plugins.push(new htmlWebpackPlugin(getHtmlConfig(element._html, element.chunks)));
})