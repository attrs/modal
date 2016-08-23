var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: path.join(__dirname, 'lib/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'x-modal.js',
    library: 'XModal',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    jquery: 'jQuery'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      }, {
        test: /\.(jpg|png|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url'
      }
    ]
  },
  devtool: 'source-map'
};
