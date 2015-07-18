/* eslint-disable no-var, no-console */

var webpack = require('webpack')
var webpackConfigGraphQL = require('./webpack.config.graphql')
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

createMoninor(webpackConfigGraphQL, {
  script: path.join(__dirname, 'dist', 'graphql.js'),
  env: {
    PORT: 3001
  }
})
