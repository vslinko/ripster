/* eslint-disable no-var, no-console, func-names */

var webpack = require('webpack');
var forever = require('forever-monitor');
var path = require('path');
var webpackConfig = require('../webpack.config.graphql');
var onBuild = require('./onBuild');

var monitor;
var compiler = webpack(webpackConfig);
var script = path.join(__dirname, '..', 'dist', 'graphql.js');

console.log('first build');

compiler.watch(100, function(err, stats) {
  if (err) {
    throw err;
  }

  if (!monitor) {
    monitor = new forever.Monitor(script, {
      max: 1,
    });
    monitor.once('start', onBuild.bind(null, stats));
    monitor.start();
  } else {
    monitor.once('restart', onBuild.bind(null, stats));
    monitor.restart();
  }
});

compiler.plugin('invalid', function() {
  console.log('rebuild');
});
