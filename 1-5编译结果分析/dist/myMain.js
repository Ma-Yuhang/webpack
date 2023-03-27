// 合并两个模块
// './src/index'
// './src/a'
(function (modules) {
  const __webpack_module_cache__ = {} // 缓存对象
  // require函数相当于运行一个模块 并得到导出结果
  function __webpack_require(moduleId) { // 传入文件路径
    // 查看有没有缓存
    if (__webpack_module_cache__[moduleId]) {
      return __webpack_module_cache__[moduleId]
    }
    const func = modules[moduleId] // 得到这个模块的函数
    let module = { // 创建一个module
      exports: {}
    }
    func.call(module.exports, module, module.exports, __webpack_require) // 调用这个函数
    const result = module.exports // 得到导出结果 并返回
    __webpack_module_cache__[moduleId] = result // 添加缓存
    return result
  }
  return __webpack_require('./src/index.js') // 默认入口文件为../src/index.js
})({
  './src/a.js': function (module, exports) {
    // console.log('module a');
    // module.exports = 'a'
    // 放在eval函数里是为了方便调试错误  //# sourceURL=webpack://test/./src/a.js这个是标注文件位置
    // eval("console.log('module a');\nconsole.log(a);\r\nmodule.exports = 'a'\n\n//# sourceURL=webpack://test/./src/a.js?");
    eval("console.log('module a');\r\nmodule.exports = 'a'\n\n//# sourceURL=webpack://test/./src/a.js?");
  },
  './src/index.js': function (module, exports, __webpack_require) {
    const a = __webpack_require('./src/a.js')
    console.log(a);
    console.log('index');
  }
})