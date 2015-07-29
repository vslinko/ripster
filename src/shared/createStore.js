import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {historyMiddleware, createRouterListener} from 'vstack-router/dist/redux'

import * as stores from './flux/stores'

export default function createAppStore(history, router, initialState) {
  const createStoreWithMiddlewares = applyMiddleware(
    historyMiddleware(history),
    thunkMiddleware
  )(createStore)

  const reduce = combineReducers(stores)

  const store = createStoreWithMiddlewares(reduce, initialState)

  router.listen(createRouterListener(store))

  return store
}
