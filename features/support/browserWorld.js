import {seleniumWorld} from './seleniumWorld'
import {jsdomWorld} from './jsdomWorld'

export function browserWorld(before, after) {
  let world = {}

  if (process.env.BROWSER_ENIGINE === 'selenium') {
    world = seleniumWorld(before, after)
  } else {
    world = jsdomWorld(before, after)
  }

  return world
}
