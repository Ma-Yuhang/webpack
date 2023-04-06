const loaderUtil = require('loader-utils')

// loader就是一个函数 接收到源代码通过loader函数生成新的代码
function loader(buffer) {
  console.log('图片字节数:' + buffer.byteLength);
  let content = null
  const { limit, filename } = this.loaders[0].options // 得到webpack.config.
  if (buffer.byteLength > limit) {
    // 图片大 使用图片
    content = getFilePath.call(this, buffer, filename)
  } else {
    // 图片小 使用base64
    content = getBase64(buffer)
    // console.log('base64', content);
  }

  return `module.exports = \`${content}\``
}
loader.raw = true // 告诉webpack给我一个原始格式
module.exports = loader

function getBase64(buffer) {
  return 'data:image/jpg;base64,' + buffer.toString('base64')
}
function getFilePath(buffer, name) {
  let filename = loaderUtil.interpolateName(this, name, {
    content: buffer
  })
  this.emitFile(filename, buffer)
  return filename
}