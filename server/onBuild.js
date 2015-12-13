function onBuild(stats) {
  const jsonStats = stats.toJson();
  const hasErrors = jsonStats.errors.length > 0;
  const hasWarnings = jsonStats.warnings.length > 0;

  if (hasErrors) {
    jsonStats.errors.forEach((message) => {
      console.error(message);
    });
  }

  if (hasWarnings) {
    jsonStats.warnings.forEach((message) => {
      console.warn(message);
    });
  }
}

module.exports = onBuild;
