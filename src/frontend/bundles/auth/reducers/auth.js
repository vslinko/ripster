import {createReducer} from 'redux-act';
import * as ac from '../actionCreators';

export default createReducer(
  {
    [ac.setToken]: (state, token) => token,
  },
  null
);
