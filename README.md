# webpack 2

webpack 是一个服务于JavaScript应用的打包工具，它的配置方式非常令人难以置信，在学习之前，非常有必要掌握它的四个核心概念。

## Entry

webpack创建了你的所有应用程序的依赖图。图的起点是一个叫做entry的入口。entry入口告诉webpack从哪开始并且按照依赖图来获知打包那些文件。你可以把应用的entry入口看做是上下文的根目录，或者用来启动你的应用的第一个文件。 在webpack，我们使用 **entry** 属性定义entry入口

### Single Entry

```
const config = {
  entry:'./main.js'
}
module.exports =  config;
```

### mutli-entries

```
const config = {
  entry: {
    app: './src/app.js',
    vendors: './src/vendors.js'
  }
};
```

## Output

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

## Loaders

Loaders的作用是将你项目中的所有资源都通过webpack进行预处理，而不是交给浏览器（这不意味着他们所有将本打包在一起）。webpack把每个文件(.css,.html,.scss,.jpg,etc.)看做一个模块(module)。 Loaders把这些文件转化成模块并将它们添加到依赖关系图中。在高级别中，它们有两个目的在你的配置中。Loaders其实是一个运行在Node.js中的函数，他们将源文件作为参数，然后返回一个新的文件。

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

### Loader 特性

1. Loaders 可以链式使用。他们运行在同一资源管道，并且按照时间顺序去编译。编译链中的第一个loader返回值给下一个直到最后一个loader。
2. Loaders 可以异步或者同步。
3. Loaders 运行在Node.js中，所有你可以在那做任何事。
4. Loaders 接受查询参数。这可以用于将配置传递给加载器。
5. Loaders 可以通过options对象配置
6. 插件可以提供loaders更多特性
7. loaders可以输出额外的任意文件

### Resolving Loaders

Loaders可以像modules一样被解析。一个loader模块将暴露一个函数方法并用Node.js兼容的JavaScript编写。在通常情况下，你可以使用npm来管理loaders,但你也可以将loaders作为你的应用程序中的文件。

## Plugins

由于loaders只在每个文件的基础上执行转换，**plugins** 大部分情况下（但不限于）在打包模块的"编译"或"chunk"上执行操作和自定义功能。webpack的插件系统是十分强大的，而且是可定制的。如果想要使用plugin，你仅仅需要 **require()** 它，然后将它加入 **plugins** 数组中。大部分plugins可以通过可选项来定制化。因为你可以在一个配置中使用某个plugin多次用于不同目的，所有你需要通过使用 **new** 创建一个它的实例,方便多次使用该plugin。

``` `
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins



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
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};

module.exports = config;
```

webpack提供大量的plugins，这也是webpack强大功能的保障。[plugins](https://webpack.js.org/plugins/).
