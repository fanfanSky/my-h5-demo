const config = require("./build/projectsConfig.js");
let projectName = process.env.PROJECT_NAME;

const path = require('path');//引入path模块

function resolve(dir) {
    return path.join(__dirname, dir)//path.join(__dirname)设置绝对路径
}

module.exports = {
  ...config[projectName],
  // 基本路径
  publicPath: "./", // vue-cli3.3+新版本使用
  // 输出文件目录
  outputDir: "dist/" + projectName + "/",
  //去除生产环境的productionSourceMap
  productionSourceMap: false,
  chainWebpack: config => {
    //set第一个参数：设置的别名，第二个参数：设置的路径
    config.resolve.alias.set('@', resolve('./src'))
    config.optimization.delete('splitChunks');
  },
  devServer: {
    allowedHosts: 'all'
  },
}
