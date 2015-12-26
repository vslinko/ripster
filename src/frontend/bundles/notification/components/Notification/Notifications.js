// adapted from https://github.com/7rulnik/evil-martians-test-project
// no license specified
import React, { Component, PropTypes } from 'react';
import { readNotification } from '../../actionCreators';
import Notification from './Notification';

// require('./Notification.css');
import styles from './Notification.less';
// import styles from './HomePage.less';

console.log(JSON.stringify(styles));

export default class Notifications extends Component {
  render() {
    const { dispatch, viewUnread, notificationList, closeTimeout,
      onHistoryClick, recentSize, onRead } = this.props;

    const importantNotifications = notificationList.filter(notification => notification.important && !notification.read);
    const unimportantNotifications = notificationList.filter(notification => !notification.important && !notification.read);
    const recentNotifications = notificationList.filter(notification => notification.important).slice(0, recentSize);

    return (
      <div className={styles.container} >
        { unimportantNotifications.length > 0 &&
          unimportantNotifications.map(notification => {
            return (
              <Notification
                {...notification}
                key={notification.id}
                timeout={closeTimeout}
                onClick={id => {
                  onRead(id);
                  if (dispatch) {
                    dispatch(readNotification(id));
                  }
                }}/>
              );
          })
        }

        { !viewUnread && importantNotifications.length > 0 &&
          <Notification
            {...importantNotifications[0]}
            onClick={id => {
              onRead(id);
              if (dispatch) {
                dispatch(readNotification(id));
              }
            }}
            totalNotifications={importantNotifications.length}
            lastItem={importantNotifications.length === 1}
          />
        }

        { viewUnread && recentNotifications.length > 0 &&
          recentNotifications.map(notification => {
            return (
              <Notification {...notification}
                key={notification.id}
                viewUnread={viewUnread}
                />
            );
          })
        }
        { viewUnread && onHistoryClick &&
          <a className={styles.history} onClick={onHistoryClick}>Notification History</a>
        }
      </div>
    );
  }
}

Notifications.propTypes = {
  dispatch: PropTypes.func,
  viewUnread: PropTypes.bool.isRequired,
  closeTimeout: PropTypes.number,
  onHistoryClick: PropTypes.func,
  onRead: PropTypes.func,
  recentSize: PropTypes.number,
  notificationList: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    date: PropTypes.number.isRequired,
    important: PropTypes.bool.isRequired,
    read: PropTypes.bool.isRequired,
  })),
};
