export function defineSteps(define) {
  return function() {
    const step = (re, cb) => {
      this.Given(re, cb) // eslint-disable-line babel/new-cap
    }

    define(step)
  }
}
