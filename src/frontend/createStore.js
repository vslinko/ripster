import { createHistory } from 'history';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reduxReactRouter } from 'redux-router';
import logger from 'redux-logger';
import { batchedSubscribe } from 'redux-batched-subscribe';
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'; // eslint-disable-line camelcase

import routes from './routes';
import reducers from './reducers';

export default function createAppStore(initialState) {
  let finalCreateStore = createStore;

  if (window.localStorage && window.localStorage.getItem('redux-logger')) {
    finalCreateStore = compose(
      applyMiddleware(logger()),
    )(finalCreateStore);
  }

  finalCreateStore = compose(
    applyMiddleware(
      thunkMiddleware
    ),
    batchedSubscribe(batchedUpdates),
    reduxReactRouter({
      routes,
      createHistory,
    }),
    window.devToolsExtension ? window.devToolsExtension() : cs => cs
  )(finalCreateStore);

  return finalCreateStore(combineReducers(reducers), initialState);
}
