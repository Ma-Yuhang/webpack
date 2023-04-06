module.exports = class fileListPlugin {
  constructor(filename = 'fileList.txt') {
    this.filename = filename
  }
  apply(compiler) {
    // 可以生成一个新的文件
    compiler.hooks.emit.tap('fileListPlugin', (compilation) => {
      const fileList = []
      for (const key in compilation.assets) {
        let content = `【${key}】
大小:${compilation.assets[key].size()/1000}KB`
        fileList.push(content)
      }
      let str = fileList.join('\n\n')
      compilation.assets[this.filename] = {
        source() {
          return str
        },
        size() {
          return str.length
        }
      }
    })
  }
}