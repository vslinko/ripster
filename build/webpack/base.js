'use strict';

const webpack = require('webpack');
const path = require('path');

const config = require('../config');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [config.src, config.tests],
        loaders: ['babel'],
      },
      {
        test: /\.json$/,
        include: [
          config.src,
          config.tests,
          path.join(config.root, 'node_modules', 'intl', 'locale-data', 'json'),
        ],
        loaders: ['json'],
      },
    ],
  },

  debug: config.dev,

  devtool: config.dev ? 'cheap-module-source-map' : 'source-map',

  plugins: () => {
    let plugins = [
      new webpack.ProvidePlugin({
        'fetch': 'isomorphic-fetch',
      }),

      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development'
        ),
      }),
    ];

    if (config.prod) {
      plugins = plugins.concat([
        new webpack.optimize.UglifyJsPlugin(),
      ]);
    }

    return plugins;
  }(),
};
