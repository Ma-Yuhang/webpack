const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: "development",
  devtool: "source-map",
  output: {
    filename: "scripts/[name].[chunkhash:5].js"
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
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