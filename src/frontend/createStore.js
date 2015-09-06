import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {historyMiddleware} from 'redux-vstack-router';

import * as stores from './flux/stores';

export default function createAppStore(history, initialState) {
  const createStoreWithMiddlewares = applyMiddleware(
    historyMiddleware(history),
    thunkMiddleware
  )(createStore);

  const reduce = combineReducers(stores);

  const store = createStoreWithMiddlewares(reduce, initialState);

  return store;
}
