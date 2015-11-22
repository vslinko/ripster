import {DefinePlugin} from 'webpack';
import path from 'path';

import config from '../config';
import frontend from './frontend';

export default {
  ...frontend,
  ...config.nodeMixin,

  entry: [
    path.join(config.src, 'cmd', 'frontendTests'),
  ],

  output: {
    ...frontend.output,
    filename: 'frontend-tests.js',
  },

  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('test'),
    }),

    ...frontend.plugins,
  ],
};
