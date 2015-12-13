if (!process.env.CI) {
  process.env.HOT_REPLACEMENT = '1';
}

const path = require('path');
const createMoninor = require('./server/createMonitor');
const testRunner = require('./server/testRunner');

const frontendPort = process.env.PORT
  ? Number(process.env.PORT)
  : 3000;
const webserverPort = frontendPort + 1;
const graphqlPort = webserverPort + 1;

if (!process.env.GRAPHQL_URL) {
  testRunner.wrap((runTests) => {
    createMoninor({
      key: 'graphql',
      script: path.join(__dirname, 'server', 'server.graphql.js'),
      env: {
        PORT: graphqlPort,
      },
      onListening: runTests,
    });
  });
}

testRunner.wrap((runTests) => {
  createMoninor({
    key: 'webserver',
    script: path.join(__dirname, 'server', 'server.webserver.js'),
    env: {
      PORT: webserverPort,
      GRAPHQL_URL: process.env.GRAPHQL_URL || 'http://localhost:' + graphqlPort + '/',
      PUBLIC_DIR: path.join(__dirname, 'src', 'public'),
    },
    onListening: runTests,
  });
});

testRunner.wrap((runTests) => {
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
