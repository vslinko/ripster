import {combineTransitions} from 'vstack-router';

const req = require.context(
  'frontend/bundles',
  true,
  /^\.\/[a-z]+\/transition(\/index)?\.js$/i
);

export default combineTransitions(
  ...req.keys().map(req)
);
