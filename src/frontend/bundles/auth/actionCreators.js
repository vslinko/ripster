import {createAction} from 'redux-act';
import cookie from 'cookie';

import applyMutation from 'frontend/utils/applyMutation';

import CreateSessionMutation from './mutations/CreateSessionMutation';

export const setToken = createAction('setToken');

export function readToken() {
  return dispatch => {
    const cookies = cookie.parse(document.cookie);

    if (cookies.token) {
      dispatch(setToken(cookies.token));
    }
  };
}

export function authorize({email, password}) {
  return async (dispatch) => {
    const result = await applyMutation(new CreateSessionMutation({email, password}));
    const token = result.createSession.session.sid;

    document.cookie = `token=${token}; path=/`;

    dispatch(setToken(token));
  };
}

export function init() {
  return (dispatch) => {
    dispatch(readToken());
  };
}
