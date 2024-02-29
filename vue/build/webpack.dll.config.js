const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: {
    vendor: [
      "vue",
      "vue-router",
      "element-plus",
      "@vueuse/core",
      "echarts",
      "vue-echarts"
    ],
  },
  mode: "production",
  output: {
    path: path.resolve(__dirname, "../dll"), // 输出目录
    filename: "[name].dll.js", // 输出文件名
    library: "[name]", // 全局变量名
  },
  plugins: [
    new webpack.DllPlugin({
      name: "[name]",// 和library一致，输出的manifest.json中的name值
      path: path.resolve(__dirname, "../dll/[name]-manifest.json"),
    }),
  ],
}