const btn = document.querySelector('button')

// 懒加载(返回一个promise)
btn.onclick = async function () {
  const { chunk } = await import(/* webpackChunkName:"lodash" */'lodash-es')
  const res = chunk([1, 2, 3, 4, 5], 2)
  console.log(res)
}