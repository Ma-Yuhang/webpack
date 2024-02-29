// webpack基础配置
// 1. 入口文件
// 2. 出口文件
// 3. loader
// 4. plugins

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const fs = require('fs')

const NODE_ENV = process.env.NODE_ENV
if (!NODE_ENV) {
  throw new Error(
    'The NODE_ENV environment variable is required but was not specified.'
  )
}

const dotenvFiles = [
  `.env`,
  `.env.${NODE_ENV}`,
  `.env.local`,
  `.env.${NODE_ENV}.local`,
].filter(Boolean)

dotenvFiles.forEach((dotenvFile) => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv').config({
      path: dotenvFile,
    })
  }
})

const isProduction = process.env.NODE_ENV === 'production'

const getStyleLoaders = (preProcessor) => {
  return [
    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
    'css-loader',
    'postcss-loader',
    preProcessor,
  ].filter(Boolean)
}

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: path.resolve(__dirname, '../src/main.ts'),
  output: {
    path: path.resolve(__dirname, '../dist'), // 打包后的目录
    filename: isProduction ? 'js/[name].[contenthash:6].js' : 'js/[name].js', // 打包后的文件名
    chunkFilename: isProduction
      ? 'js/[name].[contenthash:8].js'
      : 'js/[name].chunk.js',
    clean: true, // 清除上一次打包的文件
    publicPath: '/', // 打包后的资源的访问路径前缀
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'), // @ 代表 src 路径
      vue$: 'vue/dist/vue.runtime.esm-bundler.js',
    },
    // 引入文件的时候不需要添加后缀，这个配置也会稍微的提升构建速度
    extensions: ['.js', '.ts', '.vue', '.json'],
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  plugins: [
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      title: process.env.VUE_APP_TITLE,
      BASE_URL: process.env.BASE_URL,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../dll'),
          to: path.resolve(__dirname, '../dist/dll'),
          toType: 'dir',
        },
        {
          from: path.resolve(__dirname, '../public'),
          to: path.resolve(__dirname, '../dist'),
          toType: 'dir',
          globOptions: {
            ignore: ['**/.DS_Store', '**/index.html'],
          },
          info: {
            minimized: true,
          },
        },
      ],
    }),
    new VueLoaderPlugin(), // vue-loader插件
    new webpack.DefinePlugin({
      'process.env.VUE_APP_API_URL': JSON.stringify(
        process.env.VUE_APP_API_URL
      ),
      'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL),
      'process.env.CURRENT_ENV': JSON.stringify(process.env.CURRENT_ENV),
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:6].css',
    }),
    new ESLintPlugin({
      extensions: ['js', 'ts', 'vue', 'jsx', 'tsx'],
      exclude: 'node_modules',
      context: path.resolve(__dirname, '../src'),
      cache: true, // 开启缓存
      // 缓存目录
      cacheLocation: path.resolve(
        __dirname,
        '../node_modules/.cache/.eslintcache'
      ),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        exclude: /node_modules/,
        use: [
          'thread-loader',
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true, // 开启缓存
              cacheCompression: false, // 关闭缓存压缩
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true, // 关闭类型检测，即只进行转译
              appendTsSuffixTo: ['\\.vue$'], // 给vue文件添加ts后缀
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/,
        include: path.resolve(__dirname, '../src/assets/images'),
        type: 'asset', // webpack5通用资源处理模块，默认8kb以下的资源会被转换为base64
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 10kb以下的资源会被转换为base64
          },
        },
        generator: {
          filename: 'img/[name].[contenthash:6][ext]', //文件打包输出目录
        },
      },
      {
        test: /\.(svg)(\?.*)?$/,
        include: path.resolve(__dirname, '../src/assets/images'),
        type: 'asset/resource', // webpack5通用资源处理模块，默认会导出出单独的文件
        generator: {
          filename: 'img/[name].[contenthash:6][ext]', //文件打包输出目录
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 2 * 1024, // 2kb以下的资源会被转换为base64
          },
        },
        generator: {
          filename: 'fonts/[name].[contenthash:6][ext]', //文件打包输出目录
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 20 * 1024, // 20kb以下的资源会被转换为base64
          },
        },
        generator: {
          filename: 'media/[name].[contenthash:6][ext]', //文件打包输出目录
        },
      },
      {
        oneOf: [
          // css
          {
            test: /\.css$/i,
            exclude: [/\.module\.css$/],
            use: getStyleLoaders(),
          },
          // module.css
          {
            test: /\.module\.css$/i,
            use: [
              isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: '[name]__[local]__[hash:base64:5]',
                  },
                },
              },
              {
                loader: 'postcss-loader',
              },
            ],
          },
          // sass
          {
            test: /\.s[ac]ss$/i,
            use: [
              ...getStyleLoaders('sass-loader'),
              {
                loader: 'style-resources-loader',
                options: {
                  patterns: [
                    path.resolve(
                      __dirname,
                      '../src/assets/styles/variables.scss'
                    ),
                  ],
                },
              },
            ],
          },
          // less
          {
            test: /\.less$/i,
            use: getStyleLoaders('less-loader'),
          },
          // styl
          {
            test: /\.styl$/i,
            use: getStyleLoaders('stylus-loader'),
          },
        ],
      },
    ],
  },
}
