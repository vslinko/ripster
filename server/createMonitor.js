/* eslint-disable no-var, no-console, func-names */

var forever = require('forever-monitor');
var log = require('./log');

function createMoninor(config) {
  var monitor = new forever.Monitor(config.script, {
    silent: true,
    max: 1,
    env: config.env,
  });

  monitor.on('stdout', function(buffer) {
    var message = buffer.toString();

    if (config.onListening && /listening/.test(message)) {
      config.onListening(config.key);
    }

    log(config.key, message);
  });

  monitor.on('stderr', log.bind(null, config.key));

  monitor.start();
}

module.exports = createMoninor;
