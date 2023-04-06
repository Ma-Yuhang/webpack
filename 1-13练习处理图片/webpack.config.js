module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(png)|(jpg)$/,
        use: {
          loader: './loaders/img-loader',
          options: {
            limit: 3000, // 这个options是自己配置的 代表3000字节
            filename: 'imgs/[name]-[contenthash:5].[ext]'
          }
        }
      }
    ]
  }
}