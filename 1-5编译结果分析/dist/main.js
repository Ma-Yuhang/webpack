
(() => {
  var __webpack_modules__ = ({

    "./src/a.js": (module) => {
      eval("console.log('module a');\r\nmodule.exports = 'a'\n\n//# sourceURL=webpack://test/./src/a.js?");
    },

    "./src/index.js": (__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {
      eval("const a = __webpack_require__(/*! ./a */ \"./src/a.js\")\r\n\r\nconsole.log(a);\r\nconsole.log('index');\n\n//# sourceURL=webpack://test/./src/index.js?");
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
