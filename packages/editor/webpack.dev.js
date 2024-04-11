const merge = require('webpack-merge').default;
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 3010,
    static: './',

    compress: true,
  },
  output: {
    clean: false,
  },
});
