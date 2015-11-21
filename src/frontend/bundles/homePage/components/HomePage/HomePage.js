import React, {PropTypes} from 'react';
import {FormattedNumber, FormattedDate} from 'react-intl';

import styles from './HomePage.less';

export default class HomePage extends React.Component {
  static propTypes = {
    localeButtons: PropTypes.node,
    form: PropTypes.node,
    welcomeMessage: PropTypes.node,
    users: PropTypes.node,
    markTestElement: PropTypes.func.isRequired,
  }

  render() {
    const {markTestElement} = this.props;

    return (
      <div className={styles.container}>
        {this.props.localeButtons}
        {this.props.form}

        <div {...markTestElement('Welcome')}>
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
