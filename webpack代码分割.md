## 代码准备

由于需要演示webpack的一些优化处理，因此代码提前做了一些处理，

- 引入了vue-router路由，创建了几个view页面
- 引入了element-plus，axios，echarts，vue-echarts，@vueuse等组件丰富页面展示
- 引入了unplugin-vue-components，unplugin-auto-import等处理element-plus的按需引入
- 封装了echarts相关处理，方便按需引入echarts
- 封装了axios的处理
- 封住了mock，方便通axios在开发模式下读取模拟数据。生成模式下读取apifox中的数据(通过环境变量VUE_APP_API_URL读取)
- 封装了图片懒加载的指令

### 安装

```shell
pnpm add vue-router echarts vue-echarts element-plus @vueuse/core axios
```

```javascript
pnpm add unplugin-vue-components unplugin-auto-import mockjs -D
```

### webpack配置

```javascript
// webpack.base.js
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

......其他配置省略
plugins: [
  ......
  AutoImport({
    resolvers: [ElementPlusResolver()],
  }),
  Components({
    resolvers: [ElementPlusResolver()],
  }),
]

// webpack.dev.js
devServer: {
	......
  setupMiddlewares: require('../mock')
},
```

> 注意，由于要用到`element-plus`,第三方包中有css，所以，**我们之前配置的css-loader，exclude排除了node_modules，那么在这里是不可取的，因此需要移除**

## 代码分割

> 代码拆分最有意义的一个目的是利用客户端的长效缓存机制，来避免因为发布导致没有发生更改的第三方依赖被重复请求。

在 webpack 构建的过程中，有三种代码类型：

- 开发代码，分为**同步**模块`import xxx from xxx`和通过`import()`**异步**导入的模块；
- 通过`node_modules`依赖的第三方代码，被称为 **vendor**（供应商），它们很少像本地的源代码那样频繁修改，如果单独抽成一个 chunk，可以利用 client 的长效缓存机制，命中缓存来消除请求，减少网络请求过程中的耗时
- webpack 的 **runtime** 代码，用来连接模块化应用程序所需的所有代码，runtime 代码一般是网页加载 JS 的入口，并不涉及具体的业务，可以抽成一个单独的 chunk 并附加长效缓存机制。

## [SplitChunksPlugin](https://webpack.docschina.org/plugins/split-chunks-plugin#optimizationsplitchunks)

通过拆分打包，您可以将外包依赖项单独打包，并从客户端级别缓存中受益。执行了该过程，应用程序的整个大小依然保持不变。尽管需要执行的请求越多，会产生轻微的开销，但缓存的好处弥补了这一成本。

如果一个**带有路由(路由懒加载)**的项目，如果webpack中output配置如下：

```javascript
output: {
    path: path.resolve(__dirname, '../dist'), // 打包后的目录
    filename: 'js/[name].[chunkhash:6].js', // 打包后的文件名
    // chunkFilename: 'js/[name].[chunkhash:8].js', // 代码分割后的文件名
    ......
},
```

直接打包，打包结果会出现下面的效果

```javascript
.
├── dist
   ├── index.html
   └── js
       ├── 221.31e3b7.js
       ├── 303.cc650a.js
       ├── 67.41e71b.js
       ├── 748.fb7723.js
       ├── 922.1a20a7.js
       ├── 997.147013.js
       └── main.b6127f.js
```

很明显，懒加载路由自动帮我们做的拆包，这是由于`webpack5`的`SplitChunksPlugin`有自己的默认值配置

### 默认值

开箱即用的 `SplitChunksPlugin` 对于大部分用户来说非常友好。

默认情况下，它只会影响到按需加载的 chunks，因为修改 initial chunks 会影响到项目的 HTML 文件中的脚本标签。

`SplitChunksPlugin` 的默认行为

```javascript
module.exports = {
  //...
  optimization: {
    splitChunks: {
      // async -> 针对异步加载的 Chunk 做切割
      // initial -> 针对初始 Chunk
      // all -> 针对所有 Chunk
      chunks: 'async',
      // 切割完要生成的新 Chunk 要大于该值，否则不生成新 Chunk
      minSize: 20000,
      // 在进行代码拆分后，剩余的模块的最小大小（以字节为单位）
      minRemainingSize: 0,
      // 共享该 module 的最小 Chunk 数
      minChunks: 1,
      // 按需加载时并行加载的文件的最大数量
      maxAsyncRequests: 30,
      // 入口点的最大并行请求数
      maxInitialRequests: 30,
      // 一个块的大小超过这个阈值，它将被强制拆分成更小的块
      enforceSizeThreshold: 50000,
      // 定义缓存组，用于规定块的拆分规则
      cacheGroups: {
        // 拆分来自 node_modules 目录下的模块
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          // 如果模块已经属于其他块，将重用现有的块，而不会再新建一个块。
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```

简单来说，webpack 会在生产环境打包的时候对满足以下条件的模块自动拆分出一个 chunk 来包含它：

- 动态导入`import()`
- 新的 chunk 被两个及以上模块引用，或者 chunk 内的 module 来自于`node_modules`文件夹；
- 新的 chunk 在压缩前大于`20kB`
- 并行请求的 chunk 最大数量要`<= 30`
- 初始页面加载时并行请求的最大数量要`<= 30`

对于动态导入和路由懒加载会自动拆包的问题，相信大家都知道，不过现在有个问题是，自动拆包出来的文件名可能并不是我们想要的，这其实也是由于默认配置的原因。当然，就算我们打开output配置中的`chunkFilename: 'js/[name].[chunkhash:8].js'`这句注释，出现不同的结果也仅仅是hash长度不一样了而已。

### [optimization.chunkIds](https://webpack.docschina.org/configuration/optimization/#optimizationchunkids)

告知 webpack 当选择模块 id 时需要使用哪种算法。

- 如果环境是开发环境，那么 `optimization.chunkIds` 会被设置成 `'named'`，但当在生产环境中时，它会被设置成 `'deterministic'`
- 如果上述的条件都不符合, `optimization.chunkIds` 会被默认设置为 `'natural'`

| 选项值            | 描述                                                         |
| :---------------- | :----------------------------------------------------------- |
| `'natural'`       | 按使用顺序的数字 id。                                        |
| `'named'`         | 对调试更友好的可读的 id。                                    |
| `'deterministic'` | 在不同的编译中不变的短数字 id。有益于长期缓存。在生产模式中会默认开启。 |
| `'size'`          | 专注于让初始下载包大小更小的数字 id。                        |
| `'total-size'`    | 专注于让总下载包大小更小的数字 id。                          |

如果希望自动分包的文件名更友好，我们可以简单的配置

```javascript
optimization: {
	chunkIds: 'named',
}
```

不过这样自动分包出来，还是不够友好。

### [魔术注释(Magic Comments)](https://webpack.docschina.org/api/module-methods#magic-comments)

内联注释使这一特性得以实现。通过在 import 中添加注释，我们可以进行诸如给 chunk 命名或选择不同模式的操作。

```javascript
const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "HomeView" */ "@/views/HomeView.vue"),
  },
  {
    path: "/user",
    name: "User",
    component: () => import(/* webpackChunkName: "UserView" */ "@/views/UserView.vue"),
  },
  ......
]
```

这样自动拆包之后的文件就更加友好了。

我们甚至可以通过魔术注释，实现与 `<link rel="preload">` `<link rel="prefetch">` 相同的特性。让浏览器会在 `Idle` 状态时预先帮我们加载所需的资源，善用这个技术可以使我们的应用交互变得更加流畅。

```javascript
const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(
      /* webpackChunkName: "HomeView" */
      /* webpackPreload: true */
      "@/views/HomeView.vue"),
  },
  {
    path: "/user",
    name: "User",
    component: () => import(
      /* webpackChunkName: "UserView" */
      /* webpackPrefetch: true */
      "@/views/UserView.vue"),
  },
  ......
]
```

### entry

从`entry`入口也可以对开发代码进行拆分，当然，这针对的就不是我们一般的单页面应用程序了，一般是多页面项目

```javascript
module.exports = {
  entry: {
    home: './src/index.js',
    other: './src/main.js',
  },
  output: {
    chunkFilename: 'js/[name].[contenthash:8].js'
  },
  plugins: [
      ......
      new MiniCssExtractPlugin({
        chunkFilename: 'css/[name].[contenthash:8].chunk.css',
      }),
  ],
};
```

### 抽取 runtime chunk

使用[`optimization.runtimeChunk`](https://webpack.docschina.org/configuration/optimization/#optimizationruntimechunk)可以将 webpack 的 runtime 代码在生产环境打包的时候拆分成一个单独的 chunk，**最终生成的 runtime chunk 文件名会从`output.filename`提取生成**。

`optimization.runtimeChunk`可以传递以下三种类型的值：

- `false`：默认情况下是`false`，每个入口 chunk 中直接嵌入 runtime 的代码
- `"single"`：创建一个在所有生成 chunk 之间共享的运行时文件，更多的情况下是设置成`"single"`，此时会为 runtime 代码单独生成一个 `runtime`前缀的 chunk

```javascript
optimization: {
	runtimeChunk: 'single',
},
```

- `true` 或 `"multiple"`：为每个只含有 runtime 的入口添加一个额外 chunk，当我们指定多个入口时，就会根据多个入口每一个生成一个`runtime`的 chunk

- 设置成一个对象，对象中可以设置只有 `name` 属性

```javascript
optimization: {
  runtimeChunk: {
    name: 'runtime', // 这个配置其实和single等价
  },
},
```

也可以给`name`传递一个函数,不过这种情况等价于`true` 或 `"multiple"`，只有多入口的时候才会生效

```javascript
 entry: {
    main: './src/index.js',
    other: './src/main.js',
  },
  //...
optimization: {
  runtimeChunk: {
    name: entrypoint => `runtime~${entrypoint.name}`,
  },
},
```



### 实践过程中的拆包原则

- 将变动的与不易变动的资源进行分离，这样可以有效利用缓存
  - 一般情况下，只需要将 `node_modules` 中的资源拆分出来， `node_modules` 中的资源一般是不会变化的，就可以有效利用缓存，避免受到业务代码频繁改动的影响

- 将大的`chunk`拆分成若干个小的 `chunk` ，这样可以缩短单个资源下载时间

- 将公共模块抽离出来，这样可以避免资源被重复打包，也可以在一定程度上减小打包产物总体积

```javascript
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        name: 'chunk-vendors',
        test: /\/node_modules\//,
        priority: 10,
        chunks: 'initial' // 影响HTML脚本标签
      },
    },
  }
}
```

这样其实还是会把首页用到的一些库加载到入口文件的包中，我们可以进行更细致的分包

```javascript
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        name: 'chunk-vendors',
        test: /\/node_modules\//,
        priority: 10,
        chunks: 'initial' // 影响HTML脚本标签
      },
      echarts: {
        name: 'chunk-echarts',
        priority: 20,
        test: /\/node_modules\/_?echarts|zrender(.*)/
      },
      element: {
        name: 'chunk-element',
        priority: 20,
        test: /\/node_modules\/@?element(.*)/
      },  
    },
  }
}
```

还可以将多次用到的包分出，便于引用

```javascript
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        name: 'chunk-vendors',
        test: /\/node_modules\//,
        priority: 10,
        chunks: 'initial' // 影响HTML脚本标签
      },
      echarts: {
        name: 'chunk-echarts',
        priority: 25,
        test: /\/node_modules\/_?echarts|zrender(.*)/
      },
      element: {
        name: 'chunk-element',
        priority: 25,
        test: /\/node_modules\/@?element(.*)/
      }, 
      commons: {
        name: 'chunk-commons',
        minChunks: 2, //为了演示效果，设为只要引用2次就会被拆分，实际情况根据各自项目需要设定
        priority: 5,
        minSize: 0, //为了演示效果，设为0字节，实际情况根据各自项目需要设定
        reuseExistingChunk: true
      },
    },
  }
}
```

我们其实也可以通过函数，进行一些判断处理

```javascript
lib: {
  test(module) {
    return (
      //如果模块大于160字节，并且模块的名称包含node_modules，就会被拆分
      module.size() > 60000 &&
      module.nameForCondition() && module.nameForCondition().includes('node_modules')
    )
  },
  name(module) {
    // 匹配模块名
    const packageNameArr = module.context.match(/\/node_modules\/\.pnpm\/(.*?)(\/|$)/);
    const packageName = packageNameArr ? packageNameArr[1] : '';
		// 去掉所有@，.NET服务无法提供名称中带有@的文件
    return `chunk-lib.${packageName.replace(/@/g, "")}`;
  },
  priority: 20,
  minChunks: 1,
  reuseExistingChunk: true,
},
```

但是一些第三方模块本身是基于ES Module的，甚至自身也有一些动态导入，所以对于这部分的模块，简单的module.size()并不足以能判断，可以将这部分的内容再单独处理

```javascript
module: {
  test: /[\\/]node_modules[\\/]/,
  name(module) {
    const packageNameArr = module.context.match(/\/node_modules\/\.pnpm\/(.*?)(\/|$)/);
    const packageName = packageNameArr ? packageNameArr[1] : '';

    return `chunk-module.${packageName.replace(/@/g, "")}`;
  },
  priority: 15,
  minChunks: 1,
  reuseExistingChunk: true,
}
```

**完整配置**

```javascript
optimization: {
  chunkIds: 'named',
  runtimeChunk: "single",  
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      default: false,
      vendor: {
        name: 'chunk-vendors',
        test: /\/node_modules\//,
        priority: 10,
        chunks: 'initial',
        reuseExistingChunk: true
      },
      echarts: {
        name: 'chunk-echarts',
        priority: 25,
        test: /\/node_modules\/_?echarts|zrender(.*)/,
        reuseExistingChunk: true
      },
      element: {
        name: 'chunk-element',
        priority: 25,
        test: /\/node_modules\/@?element(.*)/,
        reuseExistingChunk: true
      },
      commons: {
        name: 'chunk-commons',
        minChunks: 2, //为了演示效果，设为只要引用2次就会被拆分，实际情况根据各自项目需要设定
        priority: 5,
        minSize: 0, //为了演示效果，设为0字节，实际情况根据各自项目需要设定
        reuseExistingChunk: true
      },
      lib: {
        test(module) {
          // console.log("--", module.size());
          // console.log("--", module.nameForCondition());
          return (
            //如果模块大于160字节，并且模块的名称包含node_modules，就会被拆分
            module.size() > 60000 &&
            module.nameForCondition() && module.nameForCondition().includes('node_modules')
          )
        },
        name(module) {
          const packageNameArr = module.context.match(/\/node_modules\/\.pnpm\/(.*?)(\/|$)/);
          const packageName = packageNameArr ? packageNameArr[1] : '';

          return `chunk-lib.${packageName.replace(/@/g, "")}`;
        },
        priority: 20,
        minChunks: 1,
        reuseExistingChunk: true,
      },
      module: {
        test: /[\\/]node_modules[\\/]/,
        name(module) {
          const packageNameArr = module.context.match(/\/node_modules\/\.pnpm\/(.*?)(\/|$)/);
          const packageName = packageNameArr ? packageNameArr[1] : '';

          return `chunk-module.${packageName.replace(/@/g, "")}`;
        },
        priority: 15,
        minChunks: 1,
        reuseExistingChunk: true,
      }
    },
  }
},
```

**配置说明：(注意优先级)**

- 先把大体积包拆分出来
  - 先大体积，较为显眼的包 echarts，element-plus 拆分出来
  - 把 node_modules 中体积大于 160000B 的依赖包拆出来
- 再把 node_modules中动态引入的包以及ES module体积较小的包拆分出来
- 将 node_modules 中的初始化需要引入的包拆分出来
- 将被引用次数大于等于 2 次的公共模块拆分出来

> **分割之后，过多的文件导致浏览器并发限制怎么办？**
>
> 在 HTTP/2 的时代，你不必在乎是不是加载的文件过多，会导致浏览器加载速度变慢。虽然说HTTP/2加载文件太多会导致变慢，不过「太多」文件意味着「几百」，也就是HTTP/2的情况下，有数百个文件，才可能会达到并发限制
>
> **HTTP/1.1 的情况，或者用户浏览器版本过低呢？**
>
> 相信我，一般这种用户在意的是页面报错了，或者页面白屏。他们不在乎网站加载的速度如何
>
> **过多过小的文件是否意味着代码压缩开销增大，以及压缩增量变大？**
>
> 经过测试，是的。
>
> 但是对比微小的压缩增量，带来的是后续缓存的优势，这是完全没有可比性的

## [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)

webpack-bundle-analyzer会根据构建统计生成可视化页面，它会帮助你分析包中包含的模块们的大小，帮助提升代码质量和网站性能。

### webpack-bundle-analyzer原理

这个插件做的工作本质就是分析在`compiler.plugin('done', function(stats))`时传入的参数stats。Stats是webpack的一个统计类,对Stats实例调用toJson()方法，获取格式化信息。

#### 如何输出stats.json

在启动 Webpack 时，支持两个参数，分别是：

- --profile：记录下构建过程中的耗时信息；
- --json：以 JSON 的格式输出构建结果，最后只输出一个 .json 文件，这个文件中包括所有构建相关的信息。

```shell
webpack --profile --json > stats.json
```

项目的根目录就会有一个 stats.json 文件（贴心建议：机器性能较差的别打开）。 这个 stats.json 文件是给可视化分析工具使用的

### 安装使用

```javascript
//安装
pnpm add webpack-bundle-analyzer -D

//使用
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    ......
    new BundleAnalyzerPlugin()
    // 默认配置
    // new BundleAnalyzerPlugin({
    //   analyzerMode: "disabled",
    //   analyzerHost: "127.0.0.1",
    //   analyzerPort: 8888,
    //   reportFilename: "report.html",
    //   defaultSizes: "parsed",
    //   openAnalyzer: true,
    //   generateStatsFile: false,
    //   statsFilename: "stats.json",
    //   logLevel: "info",
    // })
  ]
}
```

想要生成物理文件，设置`generateStatsFile: true`即可

如果生成stats.json文件，也可以通过命令行运行

```shell
npx webpack-bundle-analyzer dist/stats.json
```

当然，最好配置`package.json`脚本

```shell
"scripts": {
  ......
  "analyze": "webpack-bundle-analyzer ./dist/stats.json"
},
```



![image-20231010205938522](/Users/yingside/work/record/脚手架技术内幕/13.splitChunks/课件/assets/image-20231010205938522.png)

`stat`：文件在进行缩小等任何转换之前的“输入”大小。它是从 Webpack 的 [stats 对象](https://webpack.docschina.org/configuration/stats/)中获取的。

`parsed`：文件的“输出”大小。如果您使用的是 Webpack 插件（例如 Uglify），那么此值将反映代码的缩小大小。

`gzip`：通过 gzip 压缩运行解析的包/模块的大小。



