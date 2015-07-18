import React, {PropTypes} from 'react'

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
