import React, {PropTypes} from 'react'
import testDecorator from '../../utils/testDecorator'
import childByKey from '../../utils/childByKey'

import './HomePage.less'

@testDecorator()
export default class HomePage {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    const children = childByKey(this.props.children)

    return (
      <div className="HomePage">
        {children('localeButtons')}
        {children('form')}
      </div>
    )
  }
}
