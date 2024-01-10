const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: {
    main: './src/index.js',
    app: './src/b.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[chunkhash:8].js', // 主文件输出位置和名字
    publicPath: '/mayuhang',
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 与原来的结构一致，自动引入打包输出的资源
      template: path.resolve(__dirname, './index.html'),
    }),
  ],
  mode: 'development',
};
