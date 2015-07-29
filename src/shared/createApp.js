import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {createRouter} from 'vstack-router'
import {historyMiddleware, createRouterListener} from 'vstack-router/dist/redux'

import transition from './transition'
import * as stores from './flux/stores'

export default function createApp(history, initialState) {
  const createStoreWithMiddlewares = applyMiddleware(
    historyMiddleware(history),
    thunkMiddleware
  )(createStore)

  const reduce = combineReducers(stores)

  const store = createStoreWithMiddlewares(reduce, initialState)

  const router = createRouter(
    history,
    transition(store)
  )

  router.listen(createRouterListener(store))

  return {router, store}
}
