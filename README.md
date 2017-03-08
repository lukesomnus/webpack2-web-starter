# webpack2-web-starter
🎉🎉🎉🎉🎉🎉🎉   
一个webpack2集成开发工具，包括对html,js,css,image等文件打包处理，并提供热更新服务，加快开发效率。

## Introduction
webpack通过解决了我们开发中一个基本问题--打包，来简化web项目开发。webpack可以接受各种资源文件，例如JavaScript、css和Html、图片等等，然后将这些资源转换成便于浏览器使用的格式。这样可以减少开发者在web开发中处理这些文件的痛苦。

## Quick Start
```
# clone our repo
git clone https://github.com/lukesomnus/webpack2-web-starter.git

# change directory to our repo
cd webpack-web-starter

# install the repo with npm
npm install

# start the server
npm start
```
## Production
```
npm run build
```
生产模式包括对js转义，公共代码提取及压缩，css代码公共代码提取及压缩，小于1000kb的图片Base64转码，大于1000kb的图片压缩，给每个资源文件加上hash值等等处理。
## Quick Learning
在使用之前，我们需要掌握webpack配置中四个核心属性：**entry、output、loaders、 plugins** 。
### Entry 入口
webpack创建了你的所有应用程序的依赖图。图的起点是一个叫做entry的入口。entry入口告诉webpack从哪开始并且按照依赖图来获知打包那些文件。你可以把应用的entry入口看做是上下文的根目录，或者用来启动你的应用的第一个文件。 在webpack，我们使用 **entry** 属性定义项目入口

### Single Entry 单一入口

```
const config = {
  entry:'./main.js'
}
module.exports =  config;
```

### Mutli-entries 多入口

```
const config = {
  entry: {
    app: './src/app.js',
    vendors: './src/vendors.js'
  }
};
```

### Output 输出

当你已经打包好所有的资源，你需要告诉webpack把资源打包到哪。**output** 属性告诉webpack如何去处理打包好的代码。

```
var path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```

上面那个例子，通过output.filename和output.path两个属性告知webpack，我想将打包好的文件叫什么名字，并将它放在哪里。

### Loaders 加载器

Loaders的作用是将你项目中的所有资源都通过webpack进行预处理，而不是交给浏览器（这不意味着他们所有将本打包在一起）。webpack把每个文件(.css,.html,.scss,.jpg等等)看做一个模块(module)。 Loaders把这些文件转化成模块并将它们添加到依赖关系图中。一般，它们主要有两个目的需要体现在你的配置中。Loaders其实是一个运行在Node.js中的函数，他们将源文件作为参数，然后返回一个新的文件。

1. 确定哪些文件应该被转化成确定的loader.(使用 **test** 属性)
2. 转换该文件，以便它可以添加到你的依赖关系图中。(使用 **use** 属性)

```
var path = require('path');

const config = {
   entry: './path/to/my/entry/file.js',
   output: {
     path: path.resolve(__dirname, 'dist'),
     filename: 'my-first-webpack.bundle.js'
     },
     module: {
       rules: [ {test: /.(js|jsx)$/, use: 'babel-loader'} ] } };

module.exports = config;
```

在上面的配置中，我们定义了 **rules** 属性用来加载一个 **module**，module中有两个必须的属性 **test** 和 **use**。这告诉webpack当它在 **require()/import** 解析到以 **.js/.jsx** 结尾的文件时，使用 **babel-loader** 在打包之前转换该文件。

### Loader的特性

1. Loaders 可以链式使用。他们运行在同一资源管道，并且按照时间顺序去编译。编译链中的第一个loader返回值给下一个直到最后一个loader。
2. Loaders 可以异步或者同步。
3. Loaders 运行在Node.js中，所有你可以在那做任何事。
4. Loaders 接受查询参数。这可以用于将配置传递给加载器。
5. Loaders 可以通过options对象配置
6. 插件可以提供loaders更多特性
7. loaders可以输出额外的任意文件

### Plugins 插件

由于loaders只在每个文件的基础上执行转换，**plugins** 大部分情况下（但不限于）在打包模块的"编译"或"文件块（chunk）"上执行操作和自定义功能。webpack的插件系统是十分强大的，而且是可定制的。如果想要使用plugin，你仅仅需要 **require()** 它，然后将它加入 **plugins** 数组中。大部分plugins可以通过可选项来配置。因为你可以在一个配置中使用某个plugin多次用于不同目的，所有你需要通过使用 **new** 创建一个它的实例,方便多次使用该plugin。

```

const webpack = require('webpack'); 
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: './path/to/my/entry/file.js',
  output: {
    filename: 'my-first-webpack.bundle.js',
    path: './dist'
  },
  module: {
    rules: [
      {test: /.(js|jsx)$/, use: 'babel-loader'}
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(), //webpack built-in plugin
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};

module.exports = config;
```
webpack提供大量的plugins，这也是webpack强大功能的保障。更多插件请看官网[plugins](https://webpack.js.org/plugins/).
