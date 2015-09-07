import {createReducer} from 'redux-act';

import * as ac from '../actionCreators';

export default createReducer(
  {
    [ac.setLocale]: (state, locale) => ({...state, locale}),
    [ac.setLocaleData]: (state, localeData) => ({...state, localeData}),
    [ac.setLocaleMessages]: (state, messages) => ({...state, messages}),
  },
  {
    locale: undefined,
    localeData: undefined,
    messages: undefined,
  }
);
