import { pipe, values, reduce, merge, keys, sortBy, identity } from 'ramda';

const definitions = pipe(
  values,
  reduce(merge, {}),
  keys,
  sortBy(identity)
)(require('../../features/mapping.json'));

definitions
  .forEach(definition => console.log(definition))
