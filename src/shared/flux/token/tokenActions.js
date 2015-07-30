import cookie from 'cookie'

import {
  TOKEN
} from './tokenConstants'

export function setToken(token) {
  if (__FRONTEND__) {
    document.cookie = `token=${token}; path=/`
  }

  return {
    type: TOKEN,
    token
  }
}

export function readToken() {
  return dispatch => {
    const cookies = cookie.parse(document.cookie)

    if (cookies.token) {
      dispatch(setToken(cookies.token))
    }
  }
}
