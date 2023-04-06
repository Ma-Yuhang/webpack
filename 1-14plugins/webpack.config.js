const Myplugin = require('./plugins/myPlugin')

module.exports = {
  mode: 'development',
  watch: true,
  plugins: [
    new Myplugin()
  ]
}