// loader就是一个函数 接收到源代码通过loader函数生成新的代码
module.exports = function (sourceCode) {
  const code = `const style = document.createElement('style')
    style.innerHTML = \`${sourceCode}\`
    document.head.append(style)
    module.exports = \`${sourceCode}\``
  return code
  // return `module.exports = \`${sourceCode}\``
}