import {DefinePlugin} from 'webpack'
import path from 'path'

import config from '../config'
import base from './base'

export default {
  ...base,
  ...config.nodeMixin,

  entry: path.join(config.src, 'cmd', 'graphql'),

  output: {
    path: path.join(config.dist),
    filename: 'graphql.js'
  },

  plugins: [
    new DefinePlugin({
      '__FRONTEND__': false,
      '__BACKEND__': true
    }),

    ...base.plugins
  ]
}
