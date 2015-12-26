// adapted from https://github.com/7rulnik/evil-martians-test-project
// no license specified

/*
 * action types
 */

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const READ_ALL_NOTIFICATION = 'READ_ALL_NOTIFICATION';
export const READ_NOTIFICATION = 'READ_NOTIFICATION';
export const VIEW_UNREAD = 'VIEW_UNREAD';

/*
 * other constants
 */

export const FilterNotifcation = {
  SHOW_UNIMPORTANT: 'SHOW_UNIMPORTANT',
  SHOW_IMPORTANT: 'SHOW_IMPORTANT',
};

/*
 * action creators
 */
export function addNotification(notification) {
  return {
    type: ADD_NOTIFICATION,
    date: Date.now(),
    ...notification,
  };
}

export function readNotification(id) {
  return {
    type: READ_NOTIFICATION,
    id,
  };
}

export function readAllNotification() {
  return {
    type: READ_ALL_NOTIFICATION,
  };
}

export function viewUnread() {
  return {
    type: VIEW_UNREAD,
  };
}
