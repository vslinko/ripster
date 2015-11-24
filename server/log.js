module.exports = process.env.WINDOW_MODE
  ? require('./windowLog')
  : require('./streamLog');
