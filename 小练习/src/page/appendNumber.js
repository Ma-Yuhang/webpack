import color from '../utils/color'

const div = document.querySelector('.root')

export default function(n, isPrime) {
  const span = document.createElement('span')
  span.textContent = n
  if(isPrime) {
    span.style.color = color()
  }
  div.appendChild(span)
}