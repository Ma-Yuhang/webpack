import isPrime from "./isPrime"

export default class NumberTime {
  constructor(duration = 500) {
    this.duration = duration
    this.number = 1
    this.timerId = null
    this.onNumberCreate = null // 当数字产生的时候调用的函数
  }
  start() {
    this.timerId = setInterval(() => {
      this.onNumberCreate && this.onNumberCreate(this.number, isPrime(this.number))
      this.number++
    }, this.duration)
  }
  stop() {
    clearInterval(this.timerId)
    this.timerId = null
  }
}