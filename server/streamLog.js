/* eslint-disable no-var, no-console */

var chalk = require('chalk')
var fecha = require('fecha')
var pad = require('pad')
var timediff = require('./timediff')

var textColor = {
  graphql: chalk.blue,
  webserver: chalk.magenta,
  frontend: chalk.cyan,
  tests: chalk.yellow
}
var borderColor = {
  graphql: chalk.bgBlue,
  webserver: chalk.bgMagenta,
  frontend: chalk.bgCyan,
  tests: chalk.bgYellow
}

function log(type, message) {
  var lines = String(message).split('\n')

  lines
    .filter(function(line) {
      return line.trim().length > 0
    })
    .forEach(function(line) {
      console.log(
        chalk.yellow(fecha.format(new Date(), 'HH:mm:ss')),
        textColor[type](type.slice(0, 1)),
        textColor[type](pad(timediff(type), 7)),
        borderColor[type](' '),
        line
      )
    })
}

module.exports = log
