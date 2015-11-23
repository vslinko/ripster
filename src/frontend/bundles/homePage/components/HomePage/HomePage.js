import React, {PropTypes} from 'react';
import {FormattedNumber, FormattedDate} from 'react-intl';
import {createMarker} from 'frontend/utils/marker';

import styles from './HomePage.less';

const mark = createMarker('HomePage');

export default class HomePage extends React.Component {
  static propTypes = {
    localeButtons: PropTypes.node,
    form: PropTypes.node,
    welcomeMessage: PropTypes.node,
    users: PropTypes.node,
  }

  render() {
    return (
      <div className={styles.container} {...mark('Container')}>
        {this.props.localeButtons}
        {this.props.form}

        <div {...mark('WelcomeMessage')}>
          {this.props.welcomeMessage}
        </div>

        <div>
          <div>
            <FormattedNumber value={10.900} />
          </div>
          <div>
            <FormattedDate value={new Date(1438101264 * 1000)} />
          </div>
          <div>
            <FormattedNumber value={100000000.999999} style="currency" currency="USD" />
          </div>
        </div>

        {this.props.users}
      </div>
    );
  }
}
