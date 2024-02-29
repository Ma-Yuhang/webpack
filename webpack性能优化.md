## optimization

`optimization`这个配置项内部的很多优化策略都是在生产环境默认开启的，启用这些规则从一定程序上来讲可以显著减少 bundle 体积，优化代码生成，帮助长期缓存等。

### [optimization.minimize](https://webpack.docschina.org/configuration/optimization/#optimizationminimize)

`optimization.minimize`指定 webpack 默认使用 [`terser-webpack-plugin`](https://github.com/webpack-contrib/terser-webpack-plugin) 来压缩 JS 代码，或者使用其它在`optimization.minimizer`定义的插件。在生产环境下，这个配置项默认是`true`。

### [optimization.minimizer](https://webpack.docschina.org/configuration/optimization/#optimizationminimizer)

`optimization.minimizer`指定一个插件数组，其中包含使用的插件配置项。

比如我们希望将css文件压缩，可以使用插件**CssMinimizerWebpackPlugin**

[CssMinimizerWebpackPlugin](https://webpack.docschina.org/plugins/css-minimizer-webpack-plugin/#root)

```javascript
pnpm add css-minimizer-webpack-plugin -D
```

注意：该插件需要联合`MiniCssExtractPlugin`一起使用才有意义

```javascript
optimization: {
  minimizer: [
    new CssMinimizerPlugin(),
    "..." //使用 '...' 来访问默认值，如果没有默认值terser就会失去意义
  ],
},
```

我们也可以自定义单独指定一个针对`terser-webpack-plugin`的配置项，比如，默认webpack5使用terser打包之后会多出一些`LICENSE`的txt文件。

![image-20231017141710081](./assets/image-20231017141710081.png)

如果希望去除这些文件，可以单独配置`terser-webpack-plugin`

```javascript
const TerserPlugin = require('terser-webpack-plugin');

optimization: {
  minimize: true,
  minimizer: [
    new CssMinimizerPlugin(),
    new TerserPlugin({
      parallel: true, // 开启多进程并行压缩
      terserOptions: {
        format: {
          comments: false, // 去掉注释
        },
      },
      extractComments: false, // 不将注释提取到单独的文件中
    }),
  ],
}
```

**console.log删除**

```javascript
new TerserPlugin({
  parallel: true, // 开启多进程并行压缩
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true,
      pure_funcs: ["console.log", "console.error"]
    },
    format: {
      comments: false, // 去掉注释
    },
  },
  extractComments: false, // 不将注释提取到单独的文件中
}),
```

> 不过需要注意一个问题，删除`console.log`以及去掉注释，这些配置和`devtool`的`source-map`的一些配置产生冲突，比如：如果你设置为`devtool: 'eval-cheap-module-source-map'`，那么`TerserPlugin`的`console.log`等删除以及注释的删除将不起作用，因为`devtool: 'eval-cheap-module-source-map'`本身就会产生文件内的注释

## performance

`performance`是 webpack 内置的负责进行打包性能评估的配置，它提示当前项目内部可能需要进行优化的点，将提示信息输出在控制台。默认如果一个资源超过 250kb，webpack 会在打包的时候输出到控制台提示信息。

如果将`performance`直接设置成`false`，就可以禁用它。其他的的配置项还有：

- `performance.hints`：指定 webpack 是否在控制台打印性能提示信息，只有三个可选值：
  - `warning`：仅作为提示
  - `error`：把提示信息当成错误来输出
  - `false`：禁用性能提示信息
- `performance.maxEntrypointSize`：配置提示入口文件的大小的限制，默认是`250000`字节，当入口文件超过这个限制就会显示性能提示
- `performance.maxAssetSize`：当 webpack 生成的 bundle 等文件超过`performance.maxAssetSize`指定的大小时，就会发出性能提示信息，默认是`250000`字节。

## [cache](https://webpack.docschina.org/configuration/cache/#root)

缓存生成的 webpack 模块和 chunk，来改善构建速度。`cache` 会在`开发模式`默认开启被设置成 `type: 'memory'` 。

我们可以配置`cache: filesystem`，来缓存生成的 webpack 模块和 chunk，改善构建速度。

```javascript
cache: {
  type: 'filesystem',
  buildDependencies: {
    config: [__filename], // 依赖的模块版本发生改变时重建缓存内容
  },
},
```

文件默认生成在`node_modules/.cache/webpack`，可以通过`cacheDirectory`属性修改，不过一般不会改动

**这样可以明显加快webpack5的构建速度**

> **注意：**如果构建的时候出现错误，特别是一些过期插件导致的问题。修改错误之后。建议手动删除**.cache**下的缓存文件，再重新进行构建。不然可能会由于读取缓存文件，导致继续出现之前的错误。

**生产环境首次构建**

![image-20231017144209228](./assets/image-20231017144209228.png)

**生产环境生成cache之后**

![image-20231017144325519](./assets/image-20231017144325519.png)

**开发环境首次运行**

![image-20231017144719802](./assets/image-20231017144719802.png)

**开发环境生成cache之后**

![image-20231017144807263](./assets/image-20231017144807263.png)

![image-20231017144536632](./assets/image-20231017144536632.png)

虽然webpack5 cache开发环境和生产环境都能生效，不过开发环境效果更好，如果**生产环境是在CI/CD自动化持续集成/部署下开发**。例如：项目使用Jenkins打包并构建镜像，cache将失去意义，毕竟每次构建镜像都相当于第一次。不过一般情况下，本机开发效果还是非常明显的。

## 模块解析规则优化

### rule.include 和 rule.exclude

在使用 loader 的时候通过`include`或者`exclude`属性传入必要的路径和文件，避免全局匹配，缩小Loader对文件的搜索范围，避免不必要的转译，可以提升 webpack 构建的速度。

`babel-loader`忽略`node_modules`内部的模块

```javascript
{
  test: /\.m?jsx?$/,
  exclude: /node_modules/,
  use: [
    {
      loader: "babel-loader",
      options: {
        cacheDirectory: true, // 开启babel编译缓存
        cacheCompression: false, // 缓存文件不要压缩
      },
    }
  ]
},
```

在匹配图片文件的时候，指定具体的文件夹

```javascript
{
  test: /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/, 
  include: path.resolve(__dirname, '../src/assets/images'), //仅包含图片文件夹
  type: "asset", // webpack5内置的通用资源处理模块，默认8kb以下的资源会被转换成base64位
  parser: {
    dataUrlCondition: {
      maxSize: 8 * 1024, // 小于8kb转base64资源内联
    }
  },
  generator:{ 
    filename:'images/[name].[contenthash:6][ext]', // 输出到images目录下
  },
},
```

### cache缓存副本

配置cache缓存Loader对文件的编译副本，很多`Loader/Plugin`都提供一个可用编译缓存的选项，通过包括cache前缀，比如`babel-loader`与`eslint-webpack-plugin`

```javascript
// babel-loader
{
  test: /\.m?jsx?$/,
  exclude: /node_modules/,
  use: [
    {
      loader: "babel-loader",
      options: {
        cacheDirectory: true, // 开启babel编译缓存
        cacheCompression: false, // 缓存文件不要压缩
      },
    }
  ]
},
  
// eslint-webpack-plugin
new ESLintPlugin({
  extensions: [
    '.js',
    '.jsx',
    '.vue',
    '.ts',
    '.tsx'
  ],
  // 指定检查文件的根目录
  context: path.resolve(__dirname, "../src"),
  exclude: "node_modules", // 默认值
  cache: true, // 开启缓存
  // 缓存目录
  cacheLocation: path.resolve(
    __dirname,
    "../node_modules/.cache/.eslintcache"
  ),
}),   
```



### Resovle.alias

配置别名，不单单可以简化模块引入，其实也可以定向指定所需文件路径，提高文件搜索速度

```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, '../src'), // @ 代表 src 目录
    vue$: 'vue/dist/vue.runtime.esm-bundler.js' 
  }
},
```

### Resovle.extensions

解析的文件类型列表,引入文件时不需要加后缀

```javascript
resolve: {
  // 引入文件时不需要加后缀。
  // 这里只配置ts,js,json和vue, 其他文件引入都要求带后缀，可以稍微提升构建速度
  extensions: ['.ts', '.js', '.json','.vue'],
},
```

## [thread-loader](https://webpack.docschina.org/loaders/thread-loader/#root)

`thread-loader`是 webpack 团队提供的一个 webpack loader.

`thread-loader`利用的是 `nodejs` 的`worker pool`，也就是`nodejs`的事件轮询机制；当使用 `node` 启动 `webpack` 打包程序的时候，`webpack` 主程序会运行在事件循环的主线程上，还有 `worker pool` 负责处理高成本的任务。

**安装**

```shell
pnpm add thread-loader -D
```

**使用**

在其它 loader 的配置前面添加`thread-loader`，则它们将会在一个 `worker pool` 中运行。每个 worker 都是一个独立的 node.js 进程，开启 worker 本身会产生额外开销的，每一个 worker 都会产生大于`600ms`的延迟。也就是说，如果构建时间小于600ms，开启`worker pool` 就没有意义了，得不偿失

```javascript
module: {
  rules: [
    {
      test: /\.m?jsx?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "thread-loader",
        },
        ......
      ]
    },
    ......
	]
}
```

## 区分环境

在开发过程中，切忌在开发环境使用生产环境才会用到的工具，如在开发环境下，应该排除 `[fullhash]`/`[chunkhash]`/`[contenthash]` 等工具。

同样，在生产环境，也应该避免使用开发环境才会用到的工具，如 webpack-dev-server 等插件

```javascript
const nodeEnv = process.env.NODE_ENV;
const isProduction = nodeEnv === 'production';

module.exports = {
  entry: path.resolve(__dirname, '../src/index.ts'), // 入口文件
  output: {
    path: path.resolve(__dirname, '../dist'), // 打包后的目录
    filename: isProduction ? 'js/[name].[chunkhash:6].js' : 'js/[name].js', 
    chunkFilename: isProduction ? 'js/[name].[chunkhash:8].js' : 'js/[name].chunk.js', 
  },
  plugins: [
    ......
    isProduction && new MiniCssExtractPlugin({
      // 定义输出文件名和目录
      filename: "css/[name].[contenthash:6].css",
    }),
  ]
}
```

## 作用提升

**作用提升可以分析模块间的依赖关系，把打包好的模块合并到一个函数中**，好处是减少函数声明与内存花销。

在`webpack`中只需将打包环境设置为`生产环境`就能让`作用提升`生效，或显式设置`concatenateModules`。

```javascript
直接生产环境即可：
mode: "production"

or

显示设置：
optimization: {
  concatenateModules:true,
}

```



## 合理配置 externals

`externals`可以直接将某些模块在打包过程中剔除，这样减少 webpack 打包时候的工作量，从而加快构建速度。而且一般配置了`externals`，我们都是和CDN配合使用。

```javascript
externals: {
  "vue": "Vue",
  "vue-router": "VueRouter",
  "element-plus": 'ElementPlus',
  "@vueuse/core": "VueUse",
  "echarts": "echarts",
  "vue-echarts": "VueECharts",
}
```

```javascript
<link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/element-plus@2.3.12/dist/index.min.css"
  />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vue-echarts@6.6.1/dist/csp/style.min.css">
  
  <script src="https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vue-router@4.2.4/dist/vue-router.global.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@vueuse/shared@10.4.1/index.iife.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@vueuse/core@10.4.1/index.iife.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/element-plus@2.3.12/dist/index.full.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vue-echarts@6.6.1/dist/index.umd.min.js"></script>
```

这里配置的`key`一般是代码导入语句中`import xxx from 'vue'`，也就是from后面的值，`value`其实就是引入CDN之后，挂载到`window`上的对应的全局变量

![image-20231018100406133](./assets/image-20231018100406133.png)

> 注意：现实开发中，**应该避免使用免费的CDN**。
>
> 另外，externals的模块如果还和其他模块有关联，要么全部externals，要么就都不要，因为挂载到window上的对象在使用上和node_modules中的使用情况容易不一致

## [DllPlugin 动态链接库](https://webpack.docschina.org/plugins/dll-plugin#root)

`DllPlugin` 与 externals 的作用相似，都是将依赖抽离出去，节约打包时间。区别是 DllPlugin 是将依赖单独打包，这样以后每次只构建业务代码，而 externals 是将依赖转化为 CDN 的方式引入。并且同时还大幅度提升了构建的速度。"DLL" 一词代表微软最初引入的动态链接库

> 当公司没有很好的 CDN 资源或不支持 CDN 时，就可以考虑使用 DllPlugin ，替换掉 externals。
>
> 或者公司使用CI/CD持续集成/部署的时候，希望提升构建速度，可以考虑使用 DllPlugin

使用`DllPlugin`大致分为四步：

**1、创建定制生成dll文件的 `webpack.dll.config.js` 配置文件**

```javascript
const webpack = require("webpack");
const path = require("path");

module.exports = {
  // 需要抽离的依赖
  entry: {
    vendor: [
      "vue",
      "vue-router",
      "element-plus",
      "echarts",
      "@vueuse/core",
      "vue-echarts",
    ],
  },
  mode: "production",
  output: {
    filename: "[name].dll.js", // 输出路径和文件名称
    library: "[name]", // 全局变量名称,其他模块会从此变量上获取里面模块
    path: path.resolve(__dirname, "../dll"), // 输出目录路径(这里定义的是根目录下的dll文件夹)
  },
  plugins: [
    new webpack.DllPlugin({
      name: "[name]", // 全局变量名称：减小搜索范围，与output.library结合使用
      path: path.resolve(__dirname, "../dll/[name]-manifest.json"), // 输出目录路径
    }),
  ],
};

```

**2、配置 `package.json` 脚本**

```shell
"scripts": {
  ......
  "build:dll":"webpack -c build/webpack.dll.config.js"
},
```

**3、使用 `CopyPlugin` 插件，将生成的dll相关文件拷贝到最终打包的目录**

```javascript
new CopyPlugin({
  patterns: [
    {
      from: path.resolve(__dirname, '../dll'), // 生成的dll文件夹
      to: path.resolve(__dirname, '../dist/dll'), // 最终打包目录
      toType: 'dir'
    },
    ......
  ],
}),
```

**4、使用 `DllReferencePlugin` 将打包生成的 dll 文件，引用到需要的预编译的依赖上来，并通过 `html-webpack-tags-plugin` 在打包时自动插入 dll 文件**

**安装插件**

```javascript
pnpm add html-webpack-tags-plugin -D
```

**生产环境配置**

```javascript
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

const prodConfig = {
  mode: 'production',
  plugins: [  
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname,'../dll/vendor-manifest.json') // manifest文件路径
    }),
    new HtmlWebpackTagsPlugin({
      append: false, // 在生成资源后插入
      publicPath: '/', // 使用公共路径
      tags: ['dll/vendor.dll.js'] // 资源路径
    }),
  ],
  ......
}
```

## Tree shaking

Tree shaking 的作用：消除无用的 JS 代码，减少代码体积

```javascript
export const targetType = (target) => {
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}

export const deepClone = (obj) => { 
  if(typeof obj !== 'object' || obj === null) {
    return obj
  }
  const result = Array.isArray(obj) ? [] : {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = deepClone(obj[key])
    }
  }
  return result;
}
```

项目中只使用了 `targetType` 方法，但未使用 `deepClone` 方法，项目打包后，`deepClone` 方法不会被打包到项目里

### tree-shaking 原理

依赖于 ES6 的模块特性，ES6 模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，这就是 tree-shaking 的基础

静态分析就是不需要执行代码，就可以从字面量上对代码进行分析。ES6 之前的模块化，比如 CommonJS 是动态加载，只有执行后才知道引用的什么模块，就不能通过静态分析去做优化，正是基于这个基础上，才使得 tree-shaking 成为可能

### 合理的使用 Tree shaking

并不是说所有无用的代码都可以被消除，还是上面的代码，换个写法 `tree-shaking` 就失效了

```javascript
// util.js
export default {
  targetType(target) {
    return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
  },
  deepClone(target) {
    return JSON.parse(JSON.stringify(target));
  }
};

// 引入并使用
import util from '../util';
util.targetType(null);
```

export default 导出的是一个对象，**无法通过静态分析判断出一个对象的哪些变量未被使用，所以 tree-shaking 只对使用 export 导出的变量生效**

比如，我们在项目中引入`lodash`和`lodash-es`，同样都是引入`debounce`函数的情况下，结果是完全不一样的。

```shell
pnpm add lodash lodash-es
pnpm add @types/lodash @types/lodash-es -D
```

```javascript
// import {debounce} from 'lodash';
import {debounce} from 'lodash-es';
debounce(() => {
  console.log('debounce')
}, 1000)();
```

`lodash`是使用commonjs规范编写的，并且打包的规范是umd，简单来说，无论怎么样，如果我们引入了lodash，那么就会引入lodash中的全部内容。而lodash-es本身就是ES module模块规范编写的，这样就会很方便的帮助我们`Tree shaking`

## 图片的优化

平常大部分性能优化工作都集中在 JS 方面，但图片也是页面上非常重要的部分

特别是对于移动端来说，完全没有必要去加载原图，浪费带宽。如何去压缩图片，让图片更快的展示出来，有很多优化工作可以做

### 图片的动态裁剪

很多云服务，比如[阿里云](https://help.aliyun.com/document_detail/144582.html)或[七牛云](https://developer.qiniu.com/dora/3683/img-directions-for-use)，都提供了图片的动态裁剪功能，效果很棒，使用也非常简单，只需在图片的url地址上动态添加参数即可。唯一的确点就是要花钱。虽然有免费的次数，看着有好几百次免费，不过在现实的线上环境就是瞬间的事情...

**图片瘦身前后对比：**

瘦身前：310KB

http://image.yanhongzhi.com/record/2.jpg

![image-20231018163917966](./assets/image-20231018163917966.png)

瘦身后：16.6KB

http://image.yanhongzhi.com/record/2.jpg?imageMogr2/thumbnail/300x300

![image-20231018164134712](./assets/image-20231018164134712.png)

[第三方图片处理网站](https://tinypng.com/)

### [image-minimizer-webpack-plugin](https://www.npmjs.com/package/image-minimizer-webpack-plugin?activeTab=readme)

如果希望自己在项目中自动优化图片大小，可以使用这个插件，由于需要压缩不同的图片，因此插件还需要依赖不同图片的压缩算法

```shell
pnpm add image-minimizer-webpack-plugin -D
```

```shell
pnpm add imagemin imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo -D
```

```javascript
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

......
optimization: {
  minimize: true,
  minimizer: [
    ......
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminGenerate,
        options: {
          plugins: [
            ["gifsicle", { interlaced: true }],
            ["jpegtran", { progressive: true }],
            ["optipng", { optimizationLevel: 5 }],
            [
              "svgo",
              {
                plugins: [
                  "preset-default",
                  "prefixIds",
                  {
                    name: "sortAttrs",
                    params: {
                      xmlnsOrder: "alphabetical",
                    },
                  },
                ],
              },
            ],
          ],
        },
      },
    }),
  ],
}
```

## Gzip 压缩

线上的项目，一般都会结合构建工具 webpack 插件和服务端配置 Nginx，来实现 http 传输的 gzip 压缩，目的就是把服务端响应文件的体积尽量减小，优化返回速度。

Gzip的设置，`Nginx`服务器就能独立完成，这对于`Nginx`服务器就是几行配置的问题，就能自动的将适合类型和大小的文件转换成Gzip。这就是所谓的[Nginx动态压缩](https://nginx.org/en/docs/http/ngx_http_gzip_module.html)：都是普通文件，请求来了再压缩，然后返回给前端

当然，也可以前端或者后端人员，将文件提前压缩好，就保存在服务端，需要用的时候直接返回，这就避免了每次请求响应的时候都要压缩的问题，这个其实就是[Nginx静态压缩](https://nginx.org/en/docs/http/ngx_http_gzip_static_module.html#gzip_static)：提前把文件压缩成 .gz 格式，请求来了，直接返回即可

对于前端来说，可以使用压缩插件：[compression-webpack-plugin](https://www.npmjs.com/package/compression-webpack-plugin)

```javascript
pnpm add compression-webpack-plugin -D
```

```javascript
const CompressionPlugin = require('compression-webpack-plugin');

......
plugins: [
  ......
  new CompressionPlugin({
    algorithm: "gzip", // 压缩算法，默认gzip，也可以是brotliCompress
    test: /\.(js|css)(\?.*)?$/i, //需要压缩的文件正则
    threshold: 1024, //文件大小大于这个值时启用压缩
    deleteOriginalAssets: true //压缩后是否删除原文件
  })
]
```

> **注意：**但使用 gzip 压缩的最大错误之一，就是用 gzip 压缩页面中的每个资源文件。这里定义threshold比较小仅仅是为了测试需要

当然，压缩成`gz`文件之后，我们不能再通过之前那样，使用简单的server服务，需要服务器对gz资源进行处理。这里封装了一个简单的服务器，为了方便处理`gz`静态资源，使用了`sirv`插件

```javascript
pnpm add sirv -D
```

**server/app.cjs**

```javascript
const http = require('http')
const path = require('path')
const fs = require('fs')
// 提供静态文件服务
const sirv = require('sirv')

const defaultWD = process.cwd()

const publicPath = path.join(defaultWD, 'dist')

const assets = sirv(publicPath, { gzip: true, brotli: true })

function createServer() {
  const server = http.createServer()

  server.on('request', (req, res) => {
    assets(req, res, () => {
      res.statusCode = 404
      res.end('File not found')
    })
  })
  server.listen(8080, () => {
    const { port } = server.address()
    console.log(`server run on http://localhost:${port}`)
  })
}

function main() {
  if (!fs.existsSync(publicPath)) throw new Error('Please check your\'re already run \'npm run build\'')
  createServer()
}

main()
```

**package.json**

```javascript
"scripts": {
  ......
  "server": "node ./server/app.cjs"
},
```

