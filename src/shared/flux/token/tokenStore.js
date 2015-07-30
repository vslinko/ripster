import createStore from '../../utils/createStore'

import {
  APP_SHRINK_DATA
} from '../app/appConstants'

import {
  TOKEN
} from './tokenConstants'

const initialState = null

export default createStore(initialState, {
  [TOKEN]: (state, {token}) => token,

  [APP_SHRINK_DATA]: () => ({})
})
