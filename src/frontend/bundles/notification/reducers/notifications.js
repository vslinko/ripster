// adapted from https://github.com/7rulnik/evil-martians-test-project
// no license specified

import { combineReducers } from 'redux';
import { createReducer } from 'redux-act';

import * as ac from '../actionCreators';

const notificationList = createReducer(
  {
    [ac.addNotification]: (state, { text, important, date }) => [...state, {
      text,
      important,
      date,
      read: false,
      archive: false,
      id: [...state].length + 1,
    }].sort((a, b) => b.date - a.date),

    [ac.readNotification]: (state, { id }) => {
      return state.map(notification => notification.id === id ?
        Object.assign({}, notification, { read: true }) : notification
      );
    },

    [ac.readAllNotification]: (state, {}) => {
      return state.map(notification => notification.important ?
        Object.assign({}, notification, { read: true }) : notification
      );
    },
  },
  [{
    text: 'Welcome to ripster!',
    important: false,
    id: 1,
    read: false,
    date: 1443488209301,
  }]
);

const viewUnread = createReducer(
  {
    [ac.viewUnread]: (state, { }) => !state,
  }, true
);

const notifications = combineReducers({
  notificationList,
  viewUnread,
});

export default notifications;
