/* eslint-disable no-var */

var getbabelRelayPlugin = require('babel-relay-plugin');
var schema = require('../src/graphql/schema/schema.json');

module.exports = getbabelRelayPlugin(schema.data);
