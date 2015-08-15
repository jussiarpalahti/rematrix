var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var merge = require('webpack-merge');

var TARGET = process.env.TARGET;
var ROOT_PATH = path.resolve(__dirname);

var common = {
  entry: [path.resolve(ROOT_PATH, 'app/main')],
  resolve: {
    extensions: ['', '.js', '.jsx', '.cjsx', '.coffee']
  },
  output: {
    path: path.resolve(ROOT_PATH, 'build'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loaders: ['babel?optional[]=runtime&stage=0'],
        include: path.resolve(ROOT_PATH, 'node_modules/js-csp')
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'React Table Viewer'
    })
  ]
};

if(TARGET === 'build') {
  module.exports = merge(common, {
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel?stage=1',
          include: path.resolve(ROOT_PATH, 'app')
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          // This has effect on the react lib size
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  });
}

if(TARGET === 'dev') {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    entry: [
      'webpack/hot/dev-server'
    ],
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loaders: ['react-hot', 'babel?optional[]=runtime&stage=0'],
          include: path.resolve(ROOT_PATH, 'app'),
        },
        {
          test: /\.cjsx$/,
          loaders: ['react-hot', 'coffee', 'cjsx'],
          include: path.resolve(ROOT_PATH, 'app'),},
        { test: /\.coffee$/,
          loader: 'coffee',
          include: path.resolve(ROOT_PATH, 'app'),}
      ],
    },
  });
}
