/* eslint-disable no-var, no-console, func-names */

function onBuild(stats) {
  var jsonStats = stats.toJson();
  var hasErrors = jsonStats.errors.length > 0;
  var hasWarnings = jsonStats.warnings.length > 0;

  if (hasErrors) {
    jsonStats.errors.forEach(function(message) {
      console.error(message);
    });
  }

  if (hasWarnings) {
    jsonStats.warnings.forEach(function(message) {
      console.warn(message);
    });
  }
}

module.exports = onBuild;
