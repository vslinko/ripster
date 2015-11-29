const webpack = require('webpack');
const path = require('path');

const config = require('../config');
const frontend = require('./frontend');

module.exports = Object.assign({}, frontend, config.nodeMixin, {
  entry: [
    path.join(config.src, 'cmd', 'frontendTests'),
  ],

  output: Object.assign({}, frontend.output, {
    filename: 'frontend-tests.js',
  }),

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('test'),
    }),
  ].concat(frontend.plugins),
});
