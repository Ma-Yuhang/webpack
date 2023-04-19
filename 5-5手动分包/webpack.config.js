const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    main: './src/index.js',
    other: './src/other.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:5].js',
    clean: {
      keep: /dll\//, // 保留 'dll' 下的静态资源
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html')
    }),
    new webpack.DllReferencePlugin({
      manifest: require('./dll/jquery.manifest.json')
    }),
    new webpack.DllReferencePlugin({
      manifest: require('./dll/lodash.manifest.json')
    })
  ]
}