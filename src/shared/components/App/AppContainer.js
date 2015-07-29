import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import * as pages from '../pages'

import App from './App'

@connect(state => state.router)
export default class AppContainer {
  static propTypes = {
    screen: PropTypes.shape({
      component: PropTypes.string.isRequired,
      props: PropTypes.object.isRequired
    }).isRequired
  }

  render() {
    const {component, props} = this.props.screen
    const Component = pages[component]

    return (
      <App>
        <Component {...props} />
      </App>
    )
  }
}
