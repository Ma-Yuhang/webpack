/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _page_init__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./page/init */ \"./src/page/init.js\");\n\r\n\r\n(0,_page_init__WEBPACK_IMPORTED_MODULE_0__[\"default\"])()\n\n//# sourceURL=webpack://test/./src/index.js?");

/***/ }),

/***/ "./src/page/appendNumber.js":
/*!**********************************!*\
  !*** ./src/page/appendNumber.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _utils_color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/color */ \"./src/utils/color.js\");\n\r\n\r\nconst div = document.querySelector('.root')\r\n\r\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(n, isPrime) {\r\n  const span = document.createElement('span')\r\n  span.textContent = n\r\n  if(isPrime) {\r\n    span.style.color = (0,_utils_color__WEBPACK_IMPORTED_MODULE_0__[\"default\"])()\r\n  }\r\n  div.appendChild(span)\r\n}\n\n//# sourceURL=webpack://test/./src/page/appendNumber.js?");

/***/ }),

/***/ "./src/page/init.js":
/*!**************************!*\
  !*** ./src/page/init.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _utils_number__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/number */ \"./src/utils/number.js\");\n/* harmony import */ var _appendNumber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./appendNumber */ \"./src/page/appendNumber.js\");\n\r\n\r\nconst n = new _utils_number__WEBPACK_IMPORTED_MODULE_0__[\"default\"](100)\r\n\r\nn.onNumberCreate = function (n, isPrime) {\r\n  ;(0,_appendNumber__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(n, isPrime)\r\n}\r\n\r\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {\r\n  let flag = true\r\n  document.documentElement.addEventListener('click', function () {\r\n    if (flag) {\r\n      n.start()\r\n      flag = false\r\n    } else {\r\n      n.stop()\r\n      flag = true\r\n    }\r\n  })\r\n}\n\n//# sourceURL=webpack://test/./src/page/init.js?");

/***/ }),

/***/ "./src/utils/color.js":
/*!****************************!*\
  !*** ./src/utils/color.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n// 随机产生一个颜色\r\n\r\nconst COLOR = ['red', 'pink', 'blue', 'yellow', 'green']\r\nfunction getRandom(min, max) {\r\n  return Math.floor(Math.random() * (max - min) + min)\r\n}\r\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {\r\n  return COLOR[getRandom(0, COLOR.length)]\r\n}\n\n//# sourceURL=webpack://test/./src/utils/color.js?");

/***/ }),

/***/ "./src/utils/isPrime.js":
/*!******************************!*\
  !*** ./src/utils/isPrime.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(n) {\r\n  if (n < 2) {\r\n    return false\r\n  }\r\n  for (let i = 2; i <= n - 1; i++) {\r\n    if (n % i === 0) {\r\n      return false\r\n    }\r\n  }\r\n  return true\r\n}\n\n//# sourceURL=webpack://test/./src/utils/isPrime.js?");

/***/ }),

/***/ "./src/utils/number.js":
/*!*****************************!*\
  !*** ./src/utils/number.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ NumberTime)\n/* harmony export */ });\n/* harmony import */ var _isPrime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isPrime */ \"./src/utils/isPrime.js\");\n\r\n\r\nclass NumberTime {\r\n  constructor(duration = 500) {\r\n    this.duration = duration\r\n    this.number = 1\r\n    this.timerId = null\r\n    this.onNumberCreate = null // 当数字产生的时候调用的函数\r\n  }\r\n  start() {\r\n    this.timerId = setInterval(() => {\r\n      this.onNumberCreate && this.onNumberCreate(this.number, (0,_isPrime__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(this.number))\r\n      this.number++\r\n    }, this.duration)\r\n  }\r\n  stop() {\r\n    clearInterval(this.timerId)\r\n    this.timerId = null\r\n  }\r\n}\n\n//# sourceURL=webpack://test/./src/utils/number.js?");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;