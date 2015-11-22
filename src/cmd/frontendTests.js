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

req.keys().forEach(req);
