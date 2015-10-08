import {HotModuleReplacementPlugin, NoErrorsPlugin, optimize} from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import path from 'path';

import babelPluginRelay from '../babelPluginRelay';
import babelPluginReactTransform from 'babel-plugin-react-transform';

import autoprefixer from 'autoprefixer';
import mqpacker from 'css-mqpacker';

import config from '../config';
import base from './base';

export default {
  ...base,

  entry: [
    path.join(config.src, 'frontend'),

    ...(config.hot ? [
      'webpack-hot-middleware/client',
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
    ...base.plugins,

    ...(config.extractStyles ? [new ExtractTextPlugin('frontend.css')] : []),

    ...(config.hot ? [
      new optimize.OccurenceOrderPlugin(),
      new HotModuleReplacementPlugin(),
      new NoErrorsPlugin(),
    ] : []),
  ],

  babel: {
    ...base.babel,

    ...(config.hot ? {
      plugins: [
        babelPluginRelay,
        babelPluginReactTransform,
      ],
      extra: {
        'react-transform': {
          transforms: [
            {
              transform: 'react-transform-hmr',
              imports: ['react'],
              locals: ['module'],
            },
            {
              transform: 'react-transform-catch-errors',
              imports: ['react', 'redbox-react'],
            },
          ],
        },
      },
    } : {
      plugins: [
        babelPluginRelay,
      ],
    }),
  },
};
