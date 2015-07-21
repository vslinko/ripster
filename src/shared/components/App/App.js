import React, {PropTypes} from 'react'
import testDecorator from '../../utils/testDecorator'

@testDecorator()
export default class App {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
