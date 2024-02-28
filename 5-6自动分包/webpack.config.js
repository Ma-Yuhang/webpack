const HtmlWebpackPlugin = require('html-webpack-plugin');
// const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const TerserPlugin = require('terser-webpack-plugin')
const path = require('path');

/**
 * @type {import('webpack').Configuration} // 配置文件的代码提示
 */
module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.js',
    other: './src/other.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:5].js',
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      // 如果是多页应用，有两个页面，index.html里只引用main这个chunk的相关内容（跟entry里的chunk对应）一般不会用到
      chunks: ['main'],
    }),
    // new WebpackBundleAnalyzer() // 可视化
  ],
  // 开启cache缓存
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  optimization: {
    chunkIds: 'named',
    minimizer: [
      new TerserPlugin({
        parallel: true,  // 开启多进程压缩
        terserOptions: {
          format: {
            comments: false // 打包结果中删除注释
          },
          compress: {
            // drop_console: true, // 去除console.log
            drop_debugger: true, // 去除debugger
            pure_funcs: ['console.log','console.info','console.error']  // 想要删除的函数(包含console.log就不用配置drop_console了)
          }
        },
        extractComments: false // 不将注释提取到单独的文件（例如版权信息）
      })
    ],
    runtimeChunk: 'single', // 打包webpack运行时代码为单独的文件（runtime）
    splitChunks: {
      chunks: 'all', // 代码分割 自动提取公共模块代码
      // minSize: 0, // 默认为30000字节，大于30kb且被引用minChunks（默认1）才分包
      // minChunks: 1,
      cacheGroups: {
        // 里边的配置可覆盖全局的配置
        libs: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10, // 缓存组优先级，优先级越高，该策略越先进行处理，默认为0
          reuseExistingChunk: true,
          name: 'vendors', // jquery-lodash
        },
        default: {
          // 覆盖全局配置，将最小chunk引用数改为2
          // （也就是说，node_modules里的引用一次且大于30kb就可分包，而自己写的模块被引用两次才分包）
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true, // 重用已经分离出去的chunk
          minSize: 0,
          name: 'common',
        },
      },
    },
  },
  stats: {
    modules: false,
    // chunks: false
  },
};
