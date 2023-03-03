const path = require('path')
const os = require('os')
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 自动引入打包后的资源
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 提取css为单独的文件 代替style-loader
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); // 压缩css文件
const TerserWebpackPlugin = require("terser-webpack-plugin") 
const threads = os.cpus.length // 获取cpu的核数
// 封装样式loader函数
function gitStyleLoader(pre) {
  return [
    // 'style-loader'
    MiniCssExtractPlugin.loader, // 提取css为单独的文件
    'css-loader',
    // 解决css样式兼容性问题
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            [
              'postcss-preset-env',
            ],
          ],
        },
      },
    },
    pre
  ].filter(Boolean) // 顺序是从右向左执行
}
module.exports = {
  // 入口文件（相对路径）
  entry: './src/main.js',
  // 输出
  output: {
    // 输出路径(绝对路径)
    path: path.resolve(__dirname, '../dist'),
    // 入口文件输出文件名
    filename: 'static/js/main.js',
    clean: true // 自动清空上次打包资源
  },
  // 加载器
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/, // 匹配.css结尾的文件
            use: gitStyleLoader()
          },
          {
            test: /\.less$/, // 匹配.less结尾的文件
            use: gitStyleLoader('less-loader')
          },
          // webpack本身就能处理图片资源(可以设置转base64,转成base64后图片体积会变大，但是可以减少一次网络请求)
          // 所以一般小体积的图片的转base64
          {
            test: /\.(png|jpe?g|gif)$/,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024 // 小于10kb的图片转base64
              }
            },
            generator: {
              // 图片的输出路径 hash值取10位
              filename: 'static/images/[hash:10][ext][query]'
            }
          },
          {
            test: /\.(ttf|woff2?)$/, // 处理字体图标
            type: 'asset/resource',
            generator: {
              // 图片的输出路径 hash值取10位
              filename: 'static/icon/[hash:10][ext][query]'
            }
          },
          {
            test: /\.js$/, // 将js中es6转为es5
            exclude: /node_modules/,
            use: [
              {
                loader: 'thread-loader', // 开启多进程
                options: {
                  works: threads // 设置进程数量
                }
              },
              {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                  cacheDirectory: true, // 开启babel缓存
                  cacheCompression: false // 关闭缓存文件压缩
                }
              }
            ]
          }
        ]
      }
    ]
  },
  // 插件
  plugins:[
    new HtmlWebpackPlugin({
      // 与原来的结构一致，自动引入打包输出的资源
      template: path.resolve(__dirname, '../public/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: './static/css/main.css'
    }),
    // new CssMinimizerPlugin(),
    // new TerserWebpackPlugin({
    //   parallel: threads // 
    // })
  ],
  optimization: {
    // 建议在这里配置压缩的操作
    minimizer: [
      new CssMinimizerPlugin(), // 压缩css
      new TerserWebpackPlugin({ // 压缩js
        parallel: threads // 开启多进程设置进程数量
      })
    ]
  },
  // 模式
  mode: 'production',
  devtool: "source-map" // 文件出错位置（包含行和列）
}