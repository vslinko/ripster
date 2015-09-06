/* eslint-disable no-var */

var timers = {};

function timediff(type) {
  var diffString;
  var date = new Date();

  var diff = timers[type]
    ? date - timers[type]
    : 0;

  if (diff >= 1000 * 60 * 60) {
    diffString = String(Math.floor(diff / 1000 / 60 / 60)) + 'h';
  } else if (diff >= 1000 * 60) {
    diffString = String(Math.floor(diff / 1000 / 60)) + 'm';
  } else if (diff >= 1000) {
    diffString = String(Math.floor(diff / 1000)) + 's';
  } else {
    diffString = String(diff) + 'ms';
  }

  timers[type] = date;

  return '+' + diffString;
}

module.exports = timediff;
