/* eslint-disable max-params */

export function defineSteps(worldCreator, define) {
  return function() {
    const world = worldCreator(
      handler => this.registerHandler('BeforeFeatures', async (event, cb) => {
        try {
          await handler()
          cb()
        } catch (err) {
          cb(err)
        }
      }),

      handler => this.registerHandler('AfterFeatures', async (event, cb) => {
        try {
          await handler()
          cb()
        } catch (err) {
          cb(err)
        }
      })
    )

    const step = (re, cb) => {
      this.Given(re, (a, b, c, d, e, f) => {
        return cb(world, a, b, c, d, e, f)
      })
    }

    define(step)
  }
}
