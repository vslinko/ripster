import {
  APP_SHRINK_DATA,
  APP_STRETCH_DATA
} from './appConstants'

export function shrinkData() {
  return {
    type: APP_SHRINK_DATA
  }
}

export function stretchData() {
  return {
    type: APP_STRETCH_DATA
  }
}
