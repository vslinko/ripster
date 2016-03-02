import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

const pattern = /^\.\/[a-z]+\/reducers\/([a-z]+)\.js$/i;

const req = require.context(
  'frontend/bundles',
  true,
  /^\.\/[a-z]+\/reducers\/([a-z]+)\.js$/i
);

export default req.keys().reduce((acc, key) => {
  const name = pattern.exec(key)[1];

  acc[name] = req(key).default;

  return acc;
}, { routing: routerReducer, form: formReducer });
