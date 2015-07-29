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
