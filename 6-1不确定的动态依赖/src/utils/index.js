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
const context = require.context('./', false, /\.js$/)
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