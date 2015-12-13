import { createReducer } from 'redux-act';

import * as ac from '../actionCreators';

export default createReducer(
  {
    [ac.setLocale]: (state, { locale, messages }) => ({ locale, messages }),
  },
  {
    locale: undefined,
    messages: undefined,
  }
);
