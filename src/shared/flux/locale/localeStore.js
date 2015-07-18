import createStore from '../../utils/createStore'

import {
  LOCALE,
  LOCALE_MESSAGES
} from './localeConstants'

const initialState = {
  locale: undefined,
  messages: undefined
}

export default createStore(initialState, {
  [LOCALE]: (state, {locale}) => ({...state, locale}),
  [LOCALE_MESSAGES]: (state, {messages}) => ({...state, messages})
})
