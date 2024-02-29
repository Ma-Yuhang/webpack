const baseConfig = require('./webpack.base.js');
const { merge } = require('webpack-merge');

/**
 * @type {import('webpack').Configuration}
 */
const devConfig = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: process.env.VUE_APP_PORT || 8080,
    open: JSON.parse(process.env.VUE_APP_OPEN),
    historyApiFallback: true, // 该选项的作用所有的404都连接到index.html
    // hot:true // 模块热替换在webpack5中默认开启
    setupMiddlewares: require('../mock')
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin() // 模块热替换插件
  ]
}

module.exports = merge(baseConfig, devConfig);