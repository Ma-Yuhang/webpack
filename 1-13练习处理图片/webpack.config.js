module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(png)|(jpg)$/,
        use: {
          loader: './loaders/img-loader',
          options: {
            limit: 1024 * 200, // 这个options是自己配置的 代表200KB
            filename: 'imgs/[name]-[contenthash:5].[ext]'
          }
        }
      }
    ]
  }
}