/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/utils/a.js":
/*!************************!*\
  !*** ./src/utils/a.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// module.exports = 'a'
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('a');

/***/ }),

/***/ "./src/utils/b.js":
/*!************************!*\
  !*** ./src/utils/b.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// module.exports = 'b'
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('b');

/***/ }),

/***/ "./src/utils/c.js":
/*!************************!*\
  !*** ./src/utils/c.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// module.exports = 'c'
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('c');

/***/ }),

/***/ "./src/utils/index.js":
/*!****************************!*\
  !*** ./src/utils/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// 1.聚集模块 并统一导出（常规写法）
// ES
// export { default as a } from './a'
// export { default as b } from './b'
// export { default as c } from './c'

// commonJS
// exports.a = require('./a')
// exports.b = require('./b')
// exports.c = require('./c')

// 2.使用require.context()
const context = __webpack_require__("./src/utils sync \\.js$")
for (const k of context.keys()) {
  // console.log(k);
  if(k !== './index.js') {
    const filename = k.slice(2, -3)
    // console.log(filename);
    // console.log(k);
    // console.log(context(k));
    exports[filename] = context(k)
  }
}

/***/ }),

/***/ "./src/utils sync \\.js$":
/*!********************************************!*\
  !*** ./src/utils/ sync nonrecursive \.js$ ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./a.js": "./src/utils/a.js",
	"./b.js": "./src/utils/b.js",
	"./c.js": "./src/utils/c.js",
	"./index.js": "./src/utils/index.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/utils sync \\.js$";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_utils__WEBPACK_IMPORTED_MODULE_0__);
// const value = document.querySelector('input').value

// // 不确定的动态依赖
// // 会把utils下的文件都引入
// if (Math.random() > 0.5) {
//   const a = require('./utils/' + value)
//   console.log(a);
// }


// require.context只在webpack中有
/* 
  接收三个参数 
    1.文件路径 
    2.布尔值 是否深层递归引入，默认为true 
    3.正则表达式 只引入匹配到的文件，默认全部引入
*/
// const context = require.context('./utils', false, /\.js$/)
// console.log(context.keys()); // 是匹配到的所有结果的数组
// const a = context('./a.js')
// console.log(a);


console.log(_utils__WEBPACK_IMPORTED_MODULE_0__.a["default"], 'utils');
console.log(_utils__WEBPACK_IMPORTED_MODULE_0__.b["default"], 'utils');
console.log(_utils__WEBPACK_IMPORTED_MODULE_0__.c["default"], 'utils');
})();

/******/ })()
;
//# sourceMappingURL=main.js.map