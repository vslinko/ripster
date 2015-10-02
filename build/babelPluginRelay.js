const getBabelPluginRelay = require('babel-relay-plugin');
const schema = require('../src/graphql/schema/schema.json');

module.exports = getBabelPluginRelay(schema.data);
