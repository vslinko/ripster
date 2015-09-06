import {DefinePlugin, ProvidePlugin} from 'webpack';
import path from 'path';

import config from '../config';
import base from './base';

export default {
  ...base,
  ...config.nodeMixin,

  entry: path.join(config.src, 'cmd', 'webserver'),

  output: {
    path: path.join(config.dist),
    filename: 'webserver.js',
    publicPath: '/',
  },

  module: {
    ...base.module,

    loaders: [
      ...base.module.loaders,

      {
        test: /\.less$/,
        loaders: ['null'],
      },
      {
        test: /\.css$/,
        loaders: ['null'],
      },
    ],
  },

  plugins: [
    new DefinePlugin({
      '__FRONTEND__': false,
      '__BACKEND__': true,
    }),

    new ProvidePlugin({
      'fetch': 'node-fetch',
    }),

    ...base.plugins,
  ],
};
