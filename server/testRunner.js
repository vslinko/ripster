/* eslint-disable no-var, no-console, func-names */

var gaze = require('gaze');
var debounce = require('lodash.debounce');
var spawn = require('child_process').spawn;
var log = require('./log');

var shouldRunTests = process.env.NODE_ENV === 'test' && !process.env.CI;
var specPattern = process.env.SPECS_PATTERN || 'specs/**/*.js';

var builders = 0;
var build = 0;

var runTests = debounce(function() {
  if (!shouldRunTests) {
    return;
  }

  var makeProcess = spawn('./node_modules/.bin/babel-tape-runner', [specPattern], {
    stdio: 'pipe',
  });

  makeProcess.stdout.on('data', log.bind(null, 'tests'));
  makeProcess.stderr.on('data', log.bind(null, 'tests'));
}, 500);

function wrap(fn) {
  builders++;

  fn(function() {
    build++;

    if (build >= builders) {
      runTests();
    }
  });
}

gaze(['specs/**/*'], function(err, watcher) {
  if (err) {
    throw err;
  }

  watcher.on('all', function() {
    runTests();
  });
});

module.exports.wrap = wrap;
module.exports.runTests = runTests;
