const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = merge(base, {
  target: 'node',
  entry: './src/entry-server.js',
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    alias: {
      'api': './api/api-server.js'
    }
  },
  externals: nodeExternals({
    whiltelist: /\.css$/
  }),
  plugins: [
    new VueSSRServerPlugin()
  ]
})
