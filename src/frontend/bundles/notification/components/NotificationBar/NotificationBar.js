// adapted from https://github.com/7rulnik/evil-martians-test-project
// no license specified

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Notifications } from '../Notification';

function NotificationBar({ notifications, dispatch, onHistoryClick, onRead }) {
  return (
    <Notifications
      {...notifications}
      dispatch={dispatch}
      closeTimeout={3000}
      viewUnread={notifications.viewUnread}
      recentSize={3}
      onHistoryClick={() => onHistoryClick()}
      onRead={id => onRead(id)}
    />
  );
}

NotificationBar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  notifications: PropTypes.shape({
    viewUnread: PropTypes.bool,
    notificationList: PropTypes.array,
  }).isRequired,
};

NotificationBar.defaultProps = {
  onHistoryClick: () => {},
  onRead: () => {},
};

export default connect(
  state => ({
    notifications: state.notifications,
  })
)(NotificationBar);
