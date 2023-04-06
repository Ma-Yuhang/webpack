module.exports = class Myplugin {
  apply(compiler) { 
    // 在这里注册事件 类似于window.onload
    compiler.hooks.done.tap('Myplugin', function(compilation) {
      console.log('编译完成');
    })
  }
}