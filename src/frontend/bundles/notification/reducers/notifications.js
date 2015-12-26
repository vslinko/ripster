// adapted from https://github.com/7rulnik/evil-martians-test-project
// no license specified

import { combineReducers } from 'redux';
import { ADD_NOTIFICATION, READ_NOTIFICATION, READ_ALL_NOTIFICATION,
  VIEW_UNREAD } from '../actionCreators';

const initialState = [{
  text: 'Welcome to ripster!',
  important: false,
  id: 1,
  read: false,
  date: 1443488209301,
}];

function notificationList(state = initialState, action) {
  switch (action.type) {
    case READ_NOTIFICATION:
      return state.map(notification => notification.id === action.id ?
          Object.assign({}, notification, { read: true }) : notification
    );

    case READ_ALL_NOTIFICATION:
      return state.map(notification => notification.important ?
        Object.assign({}, notification, { read: true }) : notification
    );

    case ADD_NOTIFICATION:
      return [...state, {
        text: action.text,
        important: action.important,
        date: action.date,
        read: false,
        archive: false,
        id: [...state].length + 1,
      }].sort((a, b) => b.date - a.date);

    default:
      return state;
  }
}

function viewUnread(state = false, action) {
  switch (action.type) {
    case VIEW_UNREAD:
      return !state;

    default:
      return state;
  }
}

const notifications = combineReducers({
  notificationList,
  viewUnread,
});

export default notifications;
