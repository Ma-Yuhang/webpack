// const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
module.exports = {
  mode: "development",
  devtool: "source-map",
  output: {
    filename: "scripts/[name].[chunkhash:5].js",
    // clear: true
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    new webpack.DefinePlugin({
      PI: 'Math.PI',
      VERSION: '"1.0.0"',
      DOMAIN: '"duyi"'
    })
  ],
  devServer:{
    host: 'localhost',
    port: '3000', // 端口号
    open: true // 是否自动打开浏览器
  },
  stats: {
    modules: false,
    colors: true
  }
}