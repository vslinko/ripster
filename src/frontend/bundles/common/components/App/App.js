import React, {PropTypes} from 'react';
import testable from 'frontend/utils/testable';

@testable()
export default class App {
  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
