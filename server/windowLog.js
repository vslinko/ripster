const blessed = require('blessed');
const chalk = require('chalk');
const fecha = require('fecha');
const pad = require('pad');
const psTree = require('ps-tree');
const timediff = require('./timediff');

const screen = blessed.screen({
  smartCSR: true,
  dockBorders: true,
});

const graphqlLog = blessed.log({
  parent: screen,
  label: 'graphql',
  top: '0',
  left: '0',
  width: '50%',
  height: '20%',
  border: {
    type: 'line',
  },
  scrollable: true,
  scrollbar: {},
  style: {
    scrollbar: {
      bg: 'gray',
    },
    border: {
      fg: 'gray',
    },
  },
});

const webserverLog = blessed.log({
  parent: screen,
  label: 'webserver',
  top: '0',
  left: '50%-1',
  width: '50%+1',
  height: '20%',
  border: {
    type: 'line',
  },
  scrollable: true,
  scrollbar: {},
  style: {
    scrollbar: {
      bg: 'gray',
    },
    border: {
      fg: 'gray',
    },
  },
});

const frontendLog = blessed.log({
  parent: screen,
  label: 'frontend',
  top: '20%-1',
  left: '0',
  width: '100%',
  height: '36%+1',
  border: {
    type: 'line',
  },
  scrollable: true,
  scrollbar: {},
  style: {
    scrollbar: {
      bg: 'gray',
    },
    border: {
      fg: 'gray',
    },
  },
});

const testsLog = blessed.log({
  parent: screen,
  label: 'tests',
  top: '56%-1',
  left: '0',
  width: '100%',
  height: '44%+2',
  border: {
    type: 'line',
  },
  scrollable: true,
  scrollbar: {},
  style: {
    scrollbar: {
      bg: 'gray',
    },
    border: {
      fg: 'gray',
    },
  },
});

const terms = [graphqlLog, webserverLog, frontendLog, testsLog];

terms.forEach((term) => {
  term.on('wheelup', term.scroll.bind(term, -1));
  term.on('wheeldown', term.scroll.bind(term, 1));
});

screen.program.key(['C-c', 'q'], () => {
  screen.program.clear();
  screen.program.disableMouse();
  screen.program.showCursor();
  screen.program.normalBuffer();
  psTree(process.pid, (err, children) => {
    if (children) {
      children.forEach((processInfo) => {
        try {
          process.kill(processInfo.PID, 'SIGKILL');
        } catch (error) {
          return;
        }
      });
    }
    process.exit(0);
  });
});

const logs = {
  graphql: graphqlLog,
  webserver: webserverLog,
  frontend: frontendLog,
  tests: testsLog,
};

function log(type, message) {
  const lines = String(message).split('\n');

  lines
    .filter((line) => {
      return line.trim().length > 0;
    })
    .forEach((line) => {
      logs[type].log([
        chalk.yellow(fecha.format(new Date(), 'HH:mm:ss')),
        chalk.green(pad(timediff(type), 7)),
        line,
      ].join(' '));
    });
}

module.exports = log;
