'use strict';

const gaze = require('gaze');
const debounce = require('lodash.debounce');
const spawn = require('child_process').spawn;
const log = require('./log');

const shouldRunTests = process.env.NODE_ENV === 'test' && !process.env.CI;
const specPattern = process.env.SPECS_PATTERN || 'specs/**/*.js';

let builders = 0;
let build = 0;

const runUnitTests = () => {
  return new Promise((resolve) => {
    const makeProcess = spawn('./bin/unit_tests', [], {
      stdio: 'pipe',
    });

    makeProcess.stdout.on('data', log.bind(null, 'tests'));
    makeProcess.stderr.on('data', log.bind(null, 'tests'));

    makeProcess.on('exit', resolve);
  });
};

const runSpecs = () => {
  return new Promise((resolve) => {
    const makeProcess = spawn('./node_modules/.bin/babel-tape-runner', [specPattern], {
      stdio: 'pipe',
    });

    makeProcess.stdout.on('data', log.bind(null, 'tests'));
    makeProcess.stderr.on('data', log.bind(null, 'tests'));

    makeProcess.on('exit', resolve);
  });
};

const runTests = debounce(() => {
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
    .then(() => {
      runTests.running = false;

      if (runTests.schedule) {
        runTests.schedule = false;
        runTests();
      }
    });
}, 500);

function wrap(fn) {
  builders++;

  fn(() => {
    build++;

    if (build >= builders) {
      runTests();
    }
  });
}

gaze(['specs/**/*'], (err, watcher) => {
  if (err) {
    throw err;
  }

  watcher.on('all', () => {
    runTests();
  });
});

module.exports.wrap = wrap;
module.exports.runTests = runTests;
