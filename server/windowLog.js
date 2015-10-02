/* eslint-disable no-var, no-console, no-process-exit, func-names */

var blessed = require('blessed');
var chalk = require('chalk');
var fecha = require('fecha');
var pad = require('pad');
var psTree = require('ps-tree');
var timediff = require('./timediff');

var screen = blessed.screen({
  smartCSR: true,
  dockBorders: true,
});

var graphqlLog = blessed.log({
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

var webserverLog = blessed.log({
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

var frontendLog = blessed.log({
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

var testsLog = blessed.log({
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

var terms = [graphqlLog, webserverLog, frontendLog, testsLog];

terms.forEach(function(term) {
  term.on('wheelup', term.scroll.bind(term, -1));
  term.on('wheeldown', term.scroll.bind(term, 1));
});

screen.program.key(['C-c', 'q'], function() {
  screen.program.clear();
  screen.program.disableMouse();
  screen.program.showCursor();
  screen.program.normalBuffer();
  psTree(process.pid, function(err, children) {
    if (children) {
      children.forEach(function(processInfo) {
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

var logs = {
  graphql: graphqlLog,
  webserver: webserverLog,
  frontend: frontendLog,
  tests: testsLog,
};

function log(type, message) {
  var lines = String(message).split('\n');

  lines
    .filter(function(line) {
      return line.trim().length > 0;
    })
    .forEach(function(line) {
      logs[type].log([
        chalk.yellow(fecha.format(new Date(), 'HH:mm:ss')),
        chalk.green(pad(timediff(type), 7)),
        line,
      ].join(' '));
    });
}

module.exports = log;
