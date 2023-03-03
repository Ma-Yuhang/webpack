const path = require('path')
const os = require('os')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const threads = os.cpus.length // 获取cpu的核数

module.exports = {
  // 入口文件（相对路径）
  entry: './src/main.js',
  // 输出
  output: {
    // 输出路径(绝对路径)
    path: undefined, // 开发环境下不需要输出文件夹
    // 入口文件输出文件名
    filename: 'static/js/main.js',
    // clean: true // 自动清空上次打包资源
  },
  // 加载器
  module: {
    rules: [
      {
        // oneOf 前面的规则命中后就不在向下查找(提高编译速度)
        // 例如css文件 第一个规则命中，就不再继续匹配了(默认是就算命中规则也会继续执行)
        oneOf: [
          {
            test: /\.css$/, // 匹配.css结尾的文件
            use: ['style-loader','css-loader'] // 顺序是从右向左执行
          },
          {
            test: /\.less$/, // 匹配.less结尾的文件
            use: ['style-loader','css-loader','less-loader']
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
  ],
  // 开发服务器 不会输出资源，在内存中编译打包
  devServer:{
    host: 'localhost',
    port: '3000', // 端口号
    open: true // 是否自动打开浏览器
  },
  // 模式
  mode: 'development',
  devtool: "cheap-module-source-map" // 映射源文件（文件出错位置，只有行）
}