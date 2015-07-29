import {createRouter} from 'vstack-router'
import transition from './transition'

export default function createAppRouter(history) {
  return createRouter(
    history,
    transition
  )
}
