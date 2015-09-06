/* eslint-disable no-var, func-names */

if (!process.env.CI) {
  process.env.HOT_RELOAD = 'react-hot-loader';
}

var path = require('path');
var createMoninor = require('./server/createMonitor');
var testRunner = require('./server/testRunner');

var frontendPort = process.env.PORT
  ? Number(process.env.PORT)
  : 3000;
var webserverPort = frontendPort + 1;
var graphqlPort = webserverPort + 1;

testRunner.wrap(function(runTests) {
  createMoninor({
    key: 'graphql',
    script: path.join(__dirname, 'server', 'server.graphql.js'),
    env: {
      PORT: graphqlPort,
    },
    onListening: runTests,
  });
});

testRunner.wrap(function(runTests) {
  createMoninor({
    key: 'webserver',
    script: path.join(__dirname, 'server', 'server.webserver.js'),
    env: {
      PORT: webserverPort,
      GRAPHQL_URL: 'http://localhost:' + graphqlPort + '/',
    },
    onListening: runTests,
  });
});

testRunner.wrap(function(runTests) {
  createMoninor({
    key: 'frontend',
    script: path.join(__dirname, 'server', 'server.frontend.js'),
    env: {
      PORT: frontendPort,
      WEBSERVER_URL: 'http://localhost:' + webserverPort + '/',
    },
    onListening: runTests,
  });
});
