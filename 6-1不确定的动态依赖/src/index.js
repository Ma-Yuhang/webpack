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

import { a, b, c } from './utils'
console.log(a.default, 'utils');
console.log(b.default, 'utils');
console.log(c.default, 'utils');