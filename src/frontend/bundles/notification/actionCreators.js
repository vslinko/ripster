// adapted from https://github.com/7rulnik/evil-martians-test-project
// no license specified

export function addNotification(notification) {
  return {
    date: Date.now(),
    ...notification,
  };
}

export function readNotification(id) {
  return { id };
}

export function readAllNotification() {
  return {};
}

export function viewUnread() {
  return {};
}
