import React, {PropTypes} from 'react';
import testable from 'frontend/utils/testable';
import childrenToProps from 'frontend/utils/childrenToProps';

import './HomePage.less';

@childrenToProps
@testable()
export default class HomePage extends React.Component {
  static propTypes = {
    localeButtons: PropTypes.node,
    form: PropTypes.node,
    users: PropTypes.node,
    formatDate: PropTypes.func.isRequired,
    formatNumber: PropTypes.func.isRequired,
    formatCurrency: PropTypes.func.isRequired,
  }

  render() {
    const {formatDate, formatNumber, formatCurrency} = this.props;

    return (
      <div className="HomePage">
        {this.props.localeButtons}
        {this.props.form}

        <div>
          <div>{'number: ' + formatNumber(10.900)}</div>
          <div>{'date: ' + formatDate(new Date(1438101264 * 1000))}</div>
          <div>{'currency: ' + formatCurrency(100000000.999999, 'USD')}</div>
        </div>

        {this.props.users}
      </div>
    );
  }
}
