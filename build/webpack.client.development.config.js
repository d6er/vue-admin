const webpack = require('webpack');
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const config = merge(base, {
  entry: [
    'webpack-hot-middleware/client',
    './src/entry-client.js'
  ],
  resolve: {
    alias: {
      'api': './api/api-client.js'
    }
  },
  output: {
    filename: '[name].js'
  },
  plugins: [
    new VueSSRClientPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
})

module.exports = config
