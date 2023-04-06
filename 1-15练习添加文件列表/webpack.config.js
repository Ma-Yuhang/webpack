const Plugin = require('./plugins/plugin')
// const fileListPlugin = require('./plugins/fileListPlugin')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new Plugin('文件列表.txt')
  ]
}