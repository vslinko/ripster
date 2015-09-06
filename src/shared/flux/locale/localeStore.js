import createStore from '../../utils/createStore';

import {
  LOCALE,
  LOCALE_DATA,
  LOCALE_MESSAGES,
} from './localeConstants';

const initialState = {
  locale: undefined,
  localeData: undefined,
  messages: undefined,
};

export default createStore(initialState, {
  [LOCALE]: (state, {locale}) => ({...state, locale}),
  [LOCALE_DATA]: (state, {localeData}) => ({...state, localeData}),
  [LOCALE_MESSAGES]: (state, {messages}) => ({...state, messages}),
});
