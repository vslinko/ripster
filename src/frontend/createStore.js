import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {historyMiddleware} from 'redux-vstack-router';

import reducers from './reducers';

export default function createAppStore(history, initialState) {
  const createStoreWithMiddlewares = applyMiddleware(
    historyMiddleware(history),
    thunkMiddleware
  )(createStore);

  const reduce = combineReducers(reducers);

  const store = createStoreWithMiddlewares(reduce, initialState);

  return store;
}
