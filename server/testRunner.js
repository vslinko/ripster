/* eslint-disable no-var, no-console, func-names */

var gaze = require('gaze');
var debounce = require('lodash.debounce');
var spawn = require('child_process').spawn;
var log = require('./log');

var shouldRunTests = process.env.NODE_ENV === 'test' && !process.env.CI;
var specPattern = process.env.SPECS_PATTERN || 'specs/**/*.js';

var builders = 0;
var build = 0;

var runUnitTests = function() {
  return new Promise(function(resolve) {
    var makeProcess = spawn('./bin/unit_tests', [], {
      stdio: 'pipe',
    });

    makeProcess.stdout.on('data', log.bind(null, 'tests'));
    makeProcess.stderr.on('data', log.bind(null, 'tests'));

    makeProcess.on('exit', resolve);
  });
};

var runSpecs = function() {
  return new Promise(function(resolve) {
    var makeProcess = spawn('./node_modules/.bin/babel-tape-runner', [specPattern], {
      stdio: 'pipe',
    });

    makeProcess.stdout.on('data', log.bind(null, 'tests'));
    makeProcess.stderr.on('data', log.bind(null, 'tests'));

    makeProcess.on('exit', resolve);
  });
};

var runTests = debounce(function() {
  if (!shouldRunTests) {
    return;
  }

  if (runTests.running) {
    runTests.schedule = true;
    return;
  }

  runTests.running = true;

  runUnitTests()
    .then(runSpecs)
    .then(function() {
      runTests.running = false;

      if (runTests.schedule) {
        runTests.schedule = false;
        runTests();
      }
    });
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
