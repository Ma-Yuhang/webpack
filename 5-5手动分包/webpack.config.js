const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin')
const path = require('path')
const webpack = require('webpack')

/**
 * @type {import('webpack').Configuration}
 */
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
      template: path.resolve(__dirname, './public/index.html'),
    }),
    new HtmlWebpackTagsPlugin({
      append: false, // 在生成资源之后插入
      // publicPath: './',
      tags: ['dll/jquery.dll.js', 'dll/lodash.dll.js']
    }),
    new webpack.DllReferencePlugin({
      manifest: require('./dll/jquery.manifest.json'),
    }),
    new webpack.DllReferencePlugin({
      manifest: require('./dll/lodash.manifest.json'),
    }),
  ],
}
