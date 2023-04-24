const HtmlWebpackPlugin = require('html-webpack-plugin'); // 自动引入打包后的资源
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 提取css为单独的文件 代替style-loader
const PurgeCSSPlugin = require('purgecss-webpack-plugin'); // 做css的tree shaking
const globAll = require('glob-all')
const path = require('path')

const paths = globAll.sync([
  `${path.resolve(__dirname, 'src')}**/*.js`, // src下面的所有js文件
  `${path.resolve(__dirname, 'public/index.html')}`
])
console.log(paths);
module.exports = {
  mode: 'production',
  output: {
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: './css/main.css'
    }),
    new PurgeCSSPlugin({
      paths
    })
  ]
}