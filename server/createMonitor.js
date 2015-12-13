const forever = require('forever-monitor');
const log = require('./log');

function createMoninor(config) {
  const monitor = new forever.Monitor(config.script, {
    silent: true,
    max: 1,
    env: config.env,
  });

  monitor.on('stdout', (buffer) => {
    const message = buffer.toString();

    if (config.onListening && /listening/.test(message)) {
      config.onListening(config.key);
    }

    log(config.key, message);
  });

  monitor.on('stderr', log.bind(null, config.key));

  monitor.start();
}

module.exports = createMoninor;
