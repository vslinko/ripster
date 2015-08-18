/* eslint-disable no-var, no-console */

var WebpackDevServer = require('webpack-dev-server')
var webpack = require('webpack')
var webpackConfig = require('../webpack.config.frontend')
var onBuild = require('./onBuild')

var port = process.env.PORT
var webserverUrl = process.env.WEBSERVER_URL

var compiler = webpack(webpackConfig)

console.log('first build')

var server = new WebpackDevServer(compiler, {
  quiet: true,
  hot: true,
  stats: {
    colors: true
  },
  proxy: {
    '*': webserverUrl
  }
})

compiler.plugin('invalid', function() {
  console.log('rebuild')
})

compiler.plugin('done', function(stats) {
  console.log('listening ' + port)
  onBuild(stats)
})

server.listen(port)
