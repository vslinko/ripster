import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunkMiddleware from 'redux-thunk'
import * as stores from './flux/stores'

const createStoreWithMiddlewares = applyMiddleware(
  thunkMiddleware
)(createStore)
const reduce = combineReducers(stores)

export default function createAppStore(initialState) {
  return createStoreWithMiddlewares(reduce, initialState)
}
