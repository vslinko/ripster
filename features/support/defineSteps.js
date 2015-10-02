/* eslint-disable id-length */

import {browserWorld} from './browserWorld';

let worldCreator;
let currentWorld;

function createWorldCreator(createCallback) {
  if (worldCreator) {
    return;
  }

  worldCreator = browserWorld({
    before: createCallback('BeforeFeatures'),
    after: createCallback('AfterFeatures'),
    beforeEach: createCallback('BeforeScenario'),
    afterEach: createCallback('AfterScenario'),
  });

  createCallback('BeforeScenario')(() => {
    currentWorld = worldCreator();

    Object.keys(currentWorld)
      .forEach(key => {
        currentWorld[key] = currentWorld[key].bind(null, currentWorld);
      });
  });
}

export function defineSteps(define) {
  return function stepDefinitions() {
    const createCallback = name => handler => this.registerHandler(name, async (event, cb) => {
      try {
        await handler();
        cb();
      } catch (err) {
        cb(err);
      }
    });

    const step = (re, cb) => {
      const rem = re
        .toString()
        .replace(/^\/\^?/, '/^')
        .replace(/\$?\/([a-z]*)$/, '[ ]*(#.+)?$/$1');

      const index = rem.lastIndexOf('/');

      const reSource = rem.slice(1, index);
      const reFlags = rem.slice(index + 1);

      this.Given(new RegExp(reSource, reFlags), (a, b, c, d, e, f) => {
        return cb(currentWorld, a, b, c, d, e, f);
      });
    };

    createWorldCreator(createCallback);
    define(step);
  };
}
