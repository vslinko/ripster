// adapted from https://github.com/7rulnik/evil-martians-test-project
// no license specified

import React, { Component, PropTypes } from 'react';
// import classNames from 'classnames';

import IconCheck from 'react-icons/lib/md/check';
import IconClose from 'react-icons/lib/md/close';
import IconArrowRight from 'react-icons/lib/md/keyboard-arrow-right';

import styles from './Notification.less';

export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    const { important, timeout } = this.props;
    if (!important) {
      this.closeOnTimeout = setTimeout(this.handleClick, timeout);
    }
  }

  handleClick() {
    clearTimeout(this.closeOnTimeout);
    this.props.onClick(this.props.id);
  }

  render() {
    const { important, text, lastItem, totalNotifications, viewUnread, date } = this.props;
    const notificationStyle = viewUnread ? styles.unread : styles.notification;

    const dateObj = new Date(date);
    const day = dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    const year = dateObj.getFullYear();

    return (
      <div className={notificationStyle} ref="notification">
        <div className={styles.icon} >
          <IconCheck />
        </div>
        <p className={styles.text} >
          {text}
        </p>
        { !viewUnread &&
          <button className={styles.btn} onClick={this.handleClick} >
            {!important && <IconClose />}
            {important && lastItem && <IconClose />}
            {important && !lastItem && <IconArrowRight />}
            {important && !lastItem && <div>{totalNotifications - 1}</div>}
          </button>
        }
        { viewUnread &&
          <div className={styles.date} >{day}.{month}.{year}</div>
        }
      </div>
    );
  }
}

Notification.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
  important: PropTypes.bool,
  viewUnread: PropTypes.bool,
  id: PropTypes.number.isRequired,
  lastItem: PropTypes.bool,
  date: PropTypes.number,
  timeout: PropTypes.number.isRequired,
  totalNotifications: PropTypes.number,
};

Notification.defaultProps = {
  important: false,
  timeout: 5000,
};
