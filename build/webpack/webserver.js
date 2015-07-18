import {ProvidePlugin} from 'webpack'
import path from 'path'

import config from '../config'
import base from './base'

export default {
  ...base,
  ...config.nodeMixin,

  entry: path.join(config.src, 'cmd', 'webserver'),

  output: {
    path: path.join(config.dist),
    filename: 'webserver.js'
  },

  module: {
    ...base.module,

    loaders: [
      ...base.module.loaders,

      {
        test: /\.css$/,
        include: [config.src],
        loaders: ['null']
      }
    ]
  },

  plugins: [
    new ProvidePlugin({
      'fetch': 'node-fetch'
    }),

    ...base.plugins
  ]
}
