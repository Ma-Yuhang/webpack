const prodConfig = require('./webpack.production.js')
const baseConfig = require('./webpack.base.js')
const devConfig = require('./webpack.development.js')
module.exports = (env) => {
  if (env && env.production) {
    return {
      ...baseConfig,
      ...prodConfig
    }
  } else {
    return {
      ...baseConfig,
      ...devConfig
    }
  }
}