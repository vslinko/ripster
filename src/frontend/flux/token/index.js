import {createAction, createReducer} from 'redux-act';
import cookie from 'cookie';

const setToken = createAction((token) => {
  document.cookie = `token=${token}; path=/`;
  return token;
});

export function readToken() {
  return dispatch => {
    const cookies = cookie.parse(document.cookie);

    if (cookies.token) {
      dispatch(setToken(cookies.token));
    }
  };
}

export const reducer = createReducer(
  {
    [setToken]: (state, token) => token,
  },
  null
);
