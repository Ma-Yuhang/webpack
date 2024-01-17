const HtmlWebpackPlugin = require('html-webpack-plugin')
const EslintWebpackPlugin = require('eslint-webpack-plugin')
const path = require('path')
// 封装的处理样式的loader
function getStyleLoader(other) {
  return [
    'style-loader',
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            [
              'postcss-preset-env' // 解决样式兼容性问题
            ]
          ]
        }
      }
    },
    other
  ].filter(Boolean)
}
module.exports = {
  entry: './src/index.js',
  output: {
    path: undefined,
    filename: 'static/js/[name].js', // 主文件输出位置和名字
    chunkFilename: 'static/js/[name].chunk.js', // chunk文件
    assetModuleFilename: 'static/media/[hash:10][ext][query]' // 图片等其他资源输出位置
  },
  module: {
    rules: [
      // 处理样式资源
      {
        test: /\.css$/,
        use: getStyleLoader()
      },
      {
        test: /\.less$/,
        use: getStyleLoader('less-loader')
      },
      {
        test: /\.s[ac]ss$/,
        use: getStyleLoader('sass-loader')
      },
      {
        test: /\.styl$/,
        use: getStyleLoader('styls-loader')
      },
      // 处理图片和其他资源
      {
        test: /\.(jpe?g|png|webg|svg|gif)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 小于10kb的图片转为base64
          }
        }
      },
      {
        test: /\.(woff2?|ttf)$/,
        type: 'asset/resource',
      },
      // 处理js
      {
        test: /.jsx?$/,
        include: path.resolve(__dirname, '../src'),
        loader: 'babel-loader',
        options: {
          cacheDirectory: true, // 开启babel缓存
          cacheCompression: false // 关闭缓存文件压缩 
        }
      }
    ]
  },
  plugins: [
    new EslintWebpackPlugin({
      context: path.resolve(__dirname, '../src'),
      exclude: 'node_modules',
      cache: true,
      cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache')
    }),
    // 打包资源自动引入
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    })
  ],
  optimization: {
    splitChunks: { // 代码分割
      chunks: 'all'
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}.js`
    }
  },
  devServer: {
    host: 'localhost',
    port: 3000,
    open: true,
    hot: true
  },
  resolve: {
    // 自动补全文件扩展名
    extensions: ['.jsx','.js','.json']
  },
  mode: 'development',
  devtool: 'cheap-module-source-map'
}