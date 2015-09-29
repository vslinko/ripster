import jsdom      from 'jsdom';
import assert     from 'power-assert';

const document = jsdom.jsdom('<!doctype html><html><body></body></html>');
const window = document.defaultView;

global.assert = assert;
global.document = document;
global.window = window;
