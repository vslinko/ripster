const path = require('path');
const fs = require('fs');

const root = path.join(__dirname, '..');
const src = path.join(root, 'src');
const tests = path.join(root, 'tests');
const dist = path.join(root, 'dist');

const prod = process.env.NODE_ENV === 'production';
const test = process.env.NODE_ENV === 'test';
const dev = !prod && !test;

const hot = !prod && process.env.HOT_REPLACEMENT;

const extractStyles = !hot;

const nodeModulesDirectory = path.join(root, 'node_modules');
const nodeModulesExternals = fs.readdirSync(nodeModulesDirectory)
  .filter(name => name !== '.bin')
  .reduce((acc, name) => (
    acc[name] = `commonjs ${name}`,
    acc
  ), {});

module.exports = {
  root,
  src,
  tests,
  dist,

  prod,
  dev,

  hot,
  extractStyles,

  nodeMixin: {
    target: 'node',
    node: {
      console: false,
      process: false,
      global: false,
      Buffer: false,
      __filename: false,
      __dirname: false,
    },

    externals: [nodeModulesExternals],
  },
};
