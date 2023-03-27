// 随机产生一个颜色

const COLOR = ['red', 'pink', 'blue', 'yellow', 'green']
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}
export default function () {
  return COLOR[getRandom(0, COLOR.length)]
}