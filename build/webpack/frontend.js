import {ProvidePlugin, HotModuleReplacementPlugin} from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import path from 'path';

import autoprefixer from 'autoprefixer';
import mqpacker from 'css-mqpacker';

import config from '../config';
import base from './base';

export default {
  ...base,

  entry: [
    path.join(config.src, 'frontend'),

    ...(config.hotLoader ? [
      'webpack/hot/dev-server',
      'webpack-dev-server/client?',
    ] : []),
  ],

  output: {
    path: path.join(config.dist, 'public'),
    filename: 'frontend.js',
    publicPath: '/',
  },

  module: {
    ...base.module,

    loaders: [
      ...base.module.loaders.map(loader => (
        config.hotLoader && loader.loaders.indexOf('babel') >= 0
          && loader.loaders.unshift('react-hot'),
        loader
      )),

      {
        test: /\.less$/,
        loader: config.extractStyles
          ? ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!less?sourceMap')
          : 'style!css!postcss!less',
      },
      {
        test: /\.css$/,
        loader: config.extractStyles
          ? ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')
          : 'style!css!postcss',
      },
    ],
  },

  resolve: {
    alias: {
      frontend: path.join(config.src, 'frontend'),
      locale: path.join(config.src, 'locale'),
    },
  },

  postcss: () => ([
    autoprefixer,
    mqpacker,
  ]),

  plugins: [
    new ProvidePlugin({
      'fetch': 'exports?self.fetch!whatwg-fetch',
    }),

    ...base.plugins,

    ...(config.extractStyles ? [new ExtractTextPlugin('frontend.css')] : []),

    ...(config.hotLoader ? [new HotModuleReplacementPlugin()] : []),
  ],
};
