/* eslint-disable new-cap, no-var */

const mapping = require('./mapping.json');
const results = require('./tap.json');

module.exports = function steps() {
  var scenarioName;

  this.Before((scenario) => {
    scenarioName = scenario.getName();
  });

  this.Given(/^(.*)$/, function step(stepText, callback) {
    const spec = mapping[scenarioName] && mapping[scenarioName][stepText];

    if (!spec || !results[spec]) {
      return callback.pending();
    }

    const errors = results[spec];

    if (errors.length === 0) {
      return callback();
    }

    const firstError = errors.shift();
    const error = new Error(firstError.message);
    error.stack = firstError.stack;
    callback(error);
  });
};
