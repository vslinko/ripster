import {DefinePlugin, ProvidePlugin, HotModuleReplacementPlugin} from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import path from 'path'

import config from '../config'
import base from './base'

export default {
  ...base,

  entry: [
    path.join(config.src, 'frontend'),

    ...(config.hotLoader ? [
      'webpack/hot/dev-server',
      'webpack-dev-server/client?'
    ] : [])
  ],

  output: {
    path: path.join(config.dist, 'public'),
    filename: 'frontend.js'
  },

  module: {
    ...base.module,

    loaders: [
      ...base.module.loaders.map(loader => (
        config.hotLoader && loader.loaders.indexOf('babel') >= 0
          && loader.loaders.unshift('react-hot'),
        loader
      )),

      {
        test: /\.css$/,
        include: [config.src],
        loader: ExtractTextPlugin.extract(
          'style',
          'css?sourceMap'
        )
      }
    ]
  },

  plugins: [
    new DefinePlugin({
      '__FRONTEND__': true,
      '__BACKEND__': false
    }),

    new ProvidePlugin({
      'fetch': 'exports?self.fetch!whatwg-fetch'
    }),

    ...base.plugins,

    new ExtractTextPlugin('frontend.css'),

    ...(config.hotLoader ? [new HotModuleReplacementPlugin()] : [])
  ]
}
