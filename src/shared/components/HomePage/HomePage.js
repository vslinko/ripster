import React, {PropTypes} from 'react'
import childByKey from '../../utils/childByKey'

import './HomePage.css'

export default class HomePage {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    const children = childByKey(this.props.children)

    return (
      <div className="HomePage">
        {children('form')}
      </div>
    )
  }
}
