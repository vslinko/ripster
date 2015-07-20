/* eslint-disable no-var, babel/object-shorthand */

var chai = require('chai')

module.exports.config = {
  specs: [
    './features-dist/**/*.feature'
  ],

  capabilities: [
    {
      browserName: process.env.WDIO_BROWSER || 'chrome'
    }
  ],

  baseUrl: 'http://localhost:3000',
  waitforTimeout: 10000,

  framework: 'cucumber',
  reporter: 'spec',
  cucumberOpts: {
    ignoreUndefinedDefinitions: true
  },

  before: function() {
    global.assert = chai.assert

    global.byComponent = function(name) {
      return '[data-test-component="' + name + '"]'
    }

    global.byElement = function(name) {
      return '[data-test-element="' + name + '"]'
    }

    global.byLabel = function(label, name) {
      return '[data-test-label-' + label + '="' + name + '"]'
    }
  }
}
