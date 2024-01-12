module.exports = class Plugin {
  constructor(filename) {
    this.filename = filename
  }
  apply(compiler) {
    compiler.hooks.emit.tap('plugin', (compilation) => {
      let fileList = []
      for (const key in compilation.assets) {
        let content = `文件名字: ${key}
文件大小: ${compilation.assets[key].size()/1024}KB`
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