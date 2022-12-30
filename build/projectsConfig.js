const config = {
  // 项目名字1
  Project1: {
    pages: {
      index: {
        entry: "src/modules/Project1/main.js",
        template: "public/index.html",
        filename: "index.html"
      }
    },
    devServer: {
      historyApiFallback: true,
      inline: true,
      progress: true,
      hot: true,
    },
  },
  // 项目名字2
  Project2: {
    pages: {
      index: {
        entry: "src/modules/Project2/main.js",
        template: "public/index.html",
        filename: "index.html"
      }
    },
    devServer: {
      historyApiFallback: true,
      inline: true,
      progress: true,
      hot: true,
    },
  },

};
module.exports = config;
