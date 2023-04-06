const base64 = require('./assets/logo.jpg')
const img = document.createElement('img')
img.src = base64
img.style.height = 200 + 'px'
document.body.append(img)
console.log(base64);