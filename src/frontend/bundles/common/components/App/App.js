import React, {PropTypes} from 'react';
import testDecorator from 'frontend/utils/testDecorator';

@testDecorator()
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
