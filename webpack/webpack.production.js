const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
  mode: 'production',
  devtool: false,
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|ico)$/,
        type: 'asset/inline',
      },
    ],
  },
});
