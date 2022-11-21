/*
 * @Author: 张仕山
 * @Date: 2022-08-23 17:56:06
 * @LastEditors: 张仕山
 * @LastEditTime: 2022-11-21 11:16:11
 * @Description:
 * @FilePath: \vue.config.js
 */
const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "建筑物编码";
      return args;
    });
  },
  devServer: {
    port: 9090,
    proxy: {
      "/geoserver": {
        target: "http://106.52.200.97:8080",
        changeOrigin: true, //跨域
        secure: false, // 使用的是http协议则设置为false，https协议则设置为true
        ws: true,
        changeOrigoin: true,
        // headers: [
        //   {
        //     Host: "fourthree.club:8080",
        //   },
        // ],
        // pathRewrite: {
        //   "^/geoserver/": "",
        // },
      },
    },
  },
  publicPath: "/building/",
});
