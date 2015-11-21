import path from 'path';

import config from '../config';
import frontend from './frontend';

export default {
  ...frontend,
  ...config.nodeMixin,

  entry: [
    path.join(config.tests, 'frontend'),
  ],

  output: {
    ...frontend.output,
    filename: 'frontend-tests.js',
  },

  plugins: [
    ...frontend.plugins,
  ],
};
