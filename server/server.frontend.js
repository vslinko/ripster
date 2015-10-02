/* eslint-disable no-var, no-console, func-names */

var express = require('express');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var proxyMiddleware = require('express-http-proxy');
var webpack = require('webpack');
var webpackConfig = require('../webpack.config.frontend');
var onBuild = require('./onBuild');

var port = process.env.PORT;
var webserverUrl = process.env.WEBSERVER_URL;

var compiler = webpack(webpackConfig);

console.log('first build');

compiler.plugin('invalid', function() {
  console.log('rebuild');
});

compiler.plugin('done', function(stats) {
  console.log('listening ' + port);
  onBuild(stats);
});

var app = express();

app.use(webpackDevMiddleware(compiler, {quiet: true}));
app.use(webpackHotMiddleware(compiler, {log: false}));
app.use(proxyMiddleware(webserverUrl));

app.listen(port);
