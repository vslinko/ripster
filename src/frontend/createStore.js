import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {historyMiddleware} from 'redux-vstack-router';

import reducers from './reducers';

export default function createAppStore(history, initialState) {
  const middlewares = applyMiddleware(
    historyMiddleware(history),
    thunkMiddleware
  );

  let finalCreateStore;

  if (process.env.NODE_ENV !== 'production') {
    const {devTools, persistState} = require('redux-devtools');

    finalCreateStore = compose(
      middlewares,
      devTools(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(createStore);
  } else {
    finalCreateStore = middlewares(createStore);
  }

  const reduce = combineReducers(reducers);

  const store = finalCreateStore(reduce, initialState);

  return store;
}
