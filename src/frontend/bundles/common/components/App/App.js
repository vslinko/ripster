import React, { PropTypes } from 'react';
import { NotificationBar } from 'frontend/bundles/notification/components/NotificationBar';

export default class App extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    return (
      <div>
        <NotificationBar />

        {this.props.children}
      </div>
    );
  }
}
