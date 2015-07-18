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
  }
}
