'use strict';

const webpack = require('webpack');
const forever = require('forever-monitor');
const path = require('path');
const webpackConfig = require('../webpack.config.webserver');
const onBuild = require('./onBuild');

let monitor;
const compiler = webpack(webpackConfig);
const script = path.join(__dirname, '..', 'dist', 'webserver.js');

console.log('first build');

compiler.watch(100, (err, stats) => {
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

compiler.plugin('invalid', () => {
  console.log('rebuild');
});
