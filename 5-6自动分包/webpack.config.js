const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.js',
    other: './src/other.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:5].js',
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      chunks: ['main']
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all', // 代码分割 自动提取公共模块代码
      // minSize: 0
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          // name: 'jquery-lodash'
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
          minSize: 0,
          // name: 'common'
        },
      },
    },
  },
  stats: {
    modules: false,
    // chunks: false
  }
}