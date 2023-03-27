import NumberTime from "../utils/number";
import appendNumber from "./appendNumber";
const n = new NumberTime(100)

n.onNumberCreate = function (n, isPrime) {
  appendNumber(n, isPrime)
}

export default function () {
  let flag = true
  document.documentElement.addEventListener('click', function () {
    if (flag) {
      n.start()
      flag = false
    } else {
      n.stop()
      flag = true
    }
  })
}