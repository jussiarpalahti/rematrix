var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var merge = require('webpack-merge');

var TARGET = process.env.TARGET;
var ROOT_PATH = path.resolve(__dirname);
var BUILD, DEV;

var common = {
  resolve: {
    extensions: ['', '.js', '.jsx', '.cjsx', '.coffee', '.ts', '.tsx']
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
  BUILD = merge(common, {
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

DEV = merge(common, {
    devtool: 'eval-source-map',
    entry: [
        'webpack/hot/dev-server'
    ],
    module: {
        noParse: [
            /plotly\.js$/
        ],
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['react-hot', 'babel?optional[]=runtime&stage=0'],
                include: path.resolve(ROOT_PATH, 'app'),
            },
            {
                test: /\.cjsx$/,
                loaders: ['react-hot', 'coffee', 'cjsx'],
                include: path.resolve(ROOT_PATH, 'app')
            },
            {
                test: /\.coffee$/,
                loader: 'coffee',
                include: path.resolve(ROOT_PATH, 'app')
            },
            {
                test: /\.tsx?$/,
                loaders: ['react-hot', 'babel?optional[]=runtime&stage=0', 'ts-loader'],
                include: path.resolve(ROOT_PATH, 'app')
            }
        ]
    }
});

if(TARGET === 'dev') {
    DEV.entry = [path.resolve(ROOT_PATH, 'app/main')];
    module.exports = DEV;
} else if (TARGET === 'build') {
    BUILD.entry = [path.resolve(ROOT_PATH, 'app/main')];
    module.exports = BUILD;
} else if(TARGET === 'typed') {
    module.exports = merge(DEV, {
        entry: [path.resolve(ROOT_PATH, 'app/remain.tsx')]
    })
}