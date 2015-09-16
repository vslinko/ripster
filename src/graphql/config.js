import nconf from 'nconf';

nconf.file({
  file: 'ripster.json',
  dir: __dirname,
  search: true,
});

nconf.defaults({
  neo4j: {
    url: 'http://localhost:7474',
  },
});

export default nconf;
