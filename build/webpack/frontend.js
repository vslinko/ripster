'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const babelPluginRelay = require('../babelPluginRelay');
const babelPluginReactTransform = require('babel-plugin-react-transform');

const config = require('../config');
const base = require('./base');

module.exports = Object.assign({}, base, {
  entry: () => {
    const entry = [
      path.join(config.src, 'frontend'),
    ];

    if (config.hot) {
      return entry.concat([
        'webpack-hot-middleware/client',
      ]);
    }

    return entry;
  }(),

  output: {
    path: path.join(config.dist, 'public'),
    filename: 'frontend.js',
    publicPath: '/',
  },

  module: Object.assign({}, base.module, {
    loaders: base.module.loaders.concat([
      {
        test: /\.less$/,
        loader: config.extractStyles
          ? ExtractTextPlugin.extract('style', 'css?sourceMap&modules!less?sourceMap')
          : 'style!css?sourceMap&modules!less?sourceMap',
      },
      {
        test: /\.css$/,
        loader: config.extractStyles
          ? ExtractTextPlugin.extract('style', 'css?sourceMap&modules')
          : 'style!css?sourceMap&modules',
      },
      {
        test: /\.(png|svg|eot|ttf|woff)$/,
        loaders: ['url?limit=10000'],
      },
    ]),
  }),

  resolve: {
    alias: {
      frontend: path.join(config.src, 'frontend'),
      locale: path.join(config.src, 'locale'),
      'react-intl$': 'react-intl/lib/react-intl',
    },
  },

  plugins: () => {
    let plugins = base.plugins.concat();

    if (config.extractStyles) {
      plugins = plugins.concat([
        new ExtractTextPlugin('frontend.css'),
      ]);
    }

    if (config.hot) {
      plugins = plugins.concat([
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
      ]);
    }

    return plugins;
  }(),

  babel: () => {
    let babel = Object.assign({}, base.babel, {
      plugins: [
        babelPluginRelay,
      ],
    });

    if (config.hot) {
      babel = Object.assign({}, babel, {
        plugins: babel.plugins.concat([
          babelPluginReactTransform,
        ]),
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
      });
    }

    return babel;
  }(),
});
