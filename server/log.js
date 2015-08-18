module.exports = process.env.NODE_ENV === 'test' && !process.env.CI
  ? require('./windowLog')
  : require('./streamLog')
