module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['./loaders/style-loader']
      }
    ]
  }
}