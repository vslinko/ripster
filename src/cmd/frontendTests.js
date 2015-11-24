import 'source-map-support/register';
import 'babel/polyfill';
import {jsdom} from 'jsdom';

const document = jsdom('');
const window = document.defaultView;

global.window = window;
global.document = window.document;
global.navigator = window.navigator;
global.location = window.location;
global.self = window;

const req = require.context(
  '../frontend',
  true,
  /Test\.js$/
);

const allowedFiles = process.env.UNIT_TESTS
  ? process.env.UNIT_TESTS.split(':')
  : [];

req.keys().forEach((file) => {
  const filePath = file.replace(/^\.\//, '');

  if (allowedFiles.length === 0 || allowedFiles.indexOf(filePath) >= 0) {
    req(file);
  }
});
