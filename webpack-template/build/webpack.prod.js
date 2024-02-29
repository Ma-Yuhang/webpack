const baseConfig = require("./webpack.base.js");
const { merge } = require("webpack-merge");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const htmlWebpackTagPlugin = require("html-webpack-tags-plugin")
const webpack = require("webpack");
const path = require("path");

/**
 * @type {import('webpack').Configuration}
 */
const prodConfig = {
  mode: "production",
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, "../dll/vendor-manifest.json"),
    }),
    new htmlWebpackTagPlugin({
      append: false, // 在生成资源之后进行插入
      publicPath: "/",
      tags:['dll/vendor.dll.js']
    }),
    new BundleAnalyzerPlugin(),
  ],
  // externals: {
  //   "vue": "Vue",
  //   "vue-router": "VueRouter",
  //   "element-plus": "ELementPlus",
  //   "@vueuse/core": "VueUse",
  //   "echarts": "echarts",
  //   "vue-echarts":"VueECharts",
  // },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        parallel: true, // 开启多进程并行压缩
        terserOptions: {
          format: {
            comments: false, // 去除注释
          },
          compress: {
            drop_console: true, // 去除console.log
            drop_debugger: true, // 去除debugger
            pure_funcs: ["console.log","console.info","console.error"], // 配置发布时，不被打包的函数
          },
        },
        extractComments: false, // 不将注释提取到单独的文件中
      })
    ],
    chunkIds: "named",
    runtimeChunk: "single",
    // splitChunks: {
    //   chunks: "all", //initial、async和all
    //   // minSize: 30000, // 形成一个新代码块最小的体积
    //   // minChunks: 1, // 在分割之前，这个代码块最小应该被引用的次数
    //   cacheGroups: {
    //     vendors: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name: "vendors",
    //       priority: 10,
    //       reuseExistingChunk: true,
    //     },
    //     echarts: {
    //       test: /[\\/]node_modules[\\/]echarts|zrender(.*)/,
    //       name: "chunk-echarts",
    //       priority: 25,
    //       reuseExistingChunk: true,
    //     },
    //     element: {
    //       test: /[\\/]node_modules[\\/]element(.*)/,
    //       name: "chunk-element",
    //       priority: 25,
    //       reuseExistingChunk: true,
    //     },
    //     commons: {
    //       name: "chunk-commons",
    //       minChunks: 2,
    //       priority: 5,
    //       minSize: 0,
    //       reuseExistingChunk: true,
    //     },
    //     lib: {
    //       test(module) { 
    //         return (
    //           module.size() > 160000 &&
    //           module.nameForCondition() && 
    //           module.nameForCondition().includes('node_modules')
    //         );
    //       },
    //       name: "chunk-lib",
    //       priority: 20,
    //       minChunks:1,
    //       reuseExistingChunk: true,
    //     }
    //   }
    // }
  }
};

module.exports = merge(baseConfig, prodConfig);
