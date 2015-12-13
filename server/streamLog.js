const chalk = require('chalk');
const fecha = require('fecha');
const pad = require('pad');
const timediff = require('./timediff');

const textColor = {
  graphql: chalk.blue,
  webserver: chalk.magenta,
  frontend: chalk.cyan,
  tests: chalk.yellow,
};
const borderColor = {
  graphql: chalk.bgBlue,
  webserver: chalk.bgMagenta,
  frontend: chalk.bgCyan,
  tests: chalk.bgYellow,
};

function log(type, message) {
  const lines = String(message).split('\n');

  lines
    .filter((line) => {
      return line.trim().length > 0;
    })
    .forEach((line) => {
      console.log(
        chalk.yellow(fecha.format(new Date(), 'HH:mm:ss')),
        textColor[type](type.slice(0, 1)),
        textColor[type](pad(timediff(type), 7)),
        borderColor[type](' '),
        line
      );
    });
}

module.exports = log;
