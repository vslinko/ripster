import {DefinePlugin, optimize} from 'webpack'

import config from '../config'

export default {
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [config.src],
        loaders: ['babel']
      },
      {
        test: /\.json$/,
        include: [config.src],
        loaders: ['json']
      },
      {
        test: /\.(png|svg|eot|ttf|woff)$/,
        loaders: ['url?limit=10000']
      }
    ]
  },

  debug: config.dev,

  devtool: config.dev ? 'cheap-module-source-map' : 'source-map',

  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      )
    }),

    ...(config.prod ? [new optimize.UglifyJsPlugin()] : [])
  ]
}
