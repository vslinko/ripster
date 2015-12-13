const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const proxyMiddleware = require('express-http-proxy');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.frontend');
const onBuild = require('./onBuild');

const port = process.env.PORT;
const webserverUrl = process.env.WEBSERVER_URL;

const compiler = webpack(webpackConfig);

console.log('first build');

compiler.plugin('invalid', () => {
  console.log('rebuild');
});

compiler.plugin('done', (stats) => {
  console.log('listening ' + port);
  onBuild(stats);
});

const app = express();

app.use(webpackDevMiddleware(compiler, { quiet: true }));
app.use(webpackHotMiddleware(compiler, { log: false }));
app.use(proxyMiddleware(webserverUrl));

app.listen(port);
