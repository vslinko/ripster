const webpack = require('webpack');
const path = require('path');

const config = require('../config');
const graphql = require('./graphql');

module.exports = Object.assign({}, graphql, config.nodeMixin, {
  entry: [
    path.join(config.src, 'cmd', 'graphqlTests'),
  ],

  output: Object.assign({}, graphql.output, {
    filename: 'graphql-tests.js',
  }),

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('test'),
    }),
  ].concat(graphql.plugins),
});
