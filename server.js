/* eslint-disable no-var, no-console */

process.env.HOT_RELOAD = 'react-hot-loader'

var WebpackDevServer = require('webpack-dev-server')
var webpack = require('webpack')
var webpackConfigGraphQL = require('./webpack.config.graphql')
var webpackConfigWebserver = require('./webpack.config.webserver')
var webpackConfigFrontend = require('./webpack.config.frontend')
var forever = require('forever-monitor')
var path = require('path')

function createMoninor(webpackConfig, config) {
  var monitor

  webpack(webpackConfig)
    .watch(100, function(err, stats) {
      if (!monitor) {
        monitor = new forever.Monitor(config.script, {
          max: 1,
          env: config.env
        })
        monitor.start()
      } else {
        monitor.restart()
      }

      console.log(stats.toString({
        colors: true
      }))
    })
}

function createWebpackDevServer(webpackConfig, config) {
  var server = new WebpackDevServer(webpack(webpackConfig), {
    hot: true,
    stats: {
      colors: true
    },
    proxy: {
      '*': `http://localhost:${config.proxyPort}`
    }
  })

  server.listen(config.port)
}

createMoninor(webpackConfigGraphQL, {
  script: path.join(__dirname, 'dist', 'graphql.js'),
  env: {
    PORT: 3001
  }
})

createMoninor(webpackConfigWebserver, {
  script: path.join(__dirname, 'dist', 'webserver.js'),
  env: {
    PORT: 3002,
    GRAPHQL_URL: 'http://localhost:3001/'
  }
})

createWebpackDevServer(webpackConfigFrontend, {
  port: 3000,
  proxyPort: 3002
})
