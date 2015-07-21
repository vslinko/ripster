import React, {PropTypes} from 'react'
import testDecorator from '../../utils/testDecorator'
import childrenToProps from '../../utils/childrenToProps'

import './HomePage.less'

@childrenToProps
@testDecorator()
export default class HomePage {
  static propTypes = {
    localeButtons: PropTypes.node,
    form: PropTypes.node
  }

  render() {
    return (
      <div className="HomePage">
        {this.props.localeButtons}
        {this.props.form}
      </div>
    )
  }
}
