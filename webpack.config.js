const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */

const DEFAULT_NODE_ENV = 'production'
const NODE_ENV = process.env['NODE_ENV'] || DEFAULT_NODE_ENV

const DEFAULT_ANALYZER = 'disabled'
const ANALYZER_MODE = process.env['ANALYZER_MODE'] || DEFAULT_ANALYZER

module.exports = {
  entry: './src/index.tsx',

  output: {
    filename: '[name].[hash].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  mode: NODE_ENV,

  devtool: "source-map",

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },

  optimization: {
    minimize: NODE_ENV == DEFAULT_NODE_ENV,
    splitChunks: {
      chunks: 'all',
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: ANALYZER_MODE,
    }),
  ],
}
