(() => {
  var __webpack_modules__ = ({
    "./src/index.css": (module) => {
      eval("const style = document.createElement('style')\n    style.innerHTML = `body {\r\n  background-color: aqua;\r\n}\r\n`\n    document.head.append(style)\n    module.exports = `body {\r\n  background-color: aqua;\r\n}\r\n`\n\n//# sourceURL=webpack://test/./src/index.css?");

    },

    "./src/index.js": (__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

      eval("const style = __webpack_require__(/*! ./index.css */ \"./src/index.css\")\r\n\r\nconsole.log('11', style);\r\n\r\n\r\n// const sourceCode = require('./index.css')\r\n\r\n// const style = document.createElement('style')\r\n// style.innerHTML = sourceCode\r\n// document.head.append(style)\r\n// console.log('11', style);\n\n//# sourceURL=webpack://test/./src/index.js?");

    }
  });
  var __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = __webpack_module_cache__[moduleId] = {
      exports: {}
    };
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
  }
  var __webpack_exports__ = __webpack_require__("./src/index.js");

})()
  ;