/* eslint-disable no-var, no-console */

var gaze = require('gaze')
var debounce = require('lodash.debounce')
var spawn = require('child_process').spawn
var log = require('./log')

var shouldRunTests = process.env.NODE_ENV === 'test' && !process.env.CI

var builders = 0
var build = 0

function wrap(fn) {
  builders++

  fn(function() {
    build++

    if (build >= builders) {
      runTests()
    }
  })
}

var runTests = debounce(function() {
  if (!shouldRunTests) {
    return
  }

  var p = spawn('make', ['acceptance_test'], {
    stdio: 'pipe'
  })

  p.stdout.on('data', log.bind(null, 'tests'))
  p.stderr.on('data', log.bind(null, 'tests'))

}, 500)

gaze(['features/**/*', 'features-dist/*.feature'], function(err, watcher) {
  if (err) {
    throw err
  }

  watcher.on('all', function() {
    runTests()
  })
})

module.exports.wrap = wrap
module.exports.runTests = runTests
