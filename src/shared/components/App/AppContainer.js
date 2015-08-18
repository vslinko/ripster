import React from 'react'
import {connect} from 'react-redux'
import * as pages from '../pages'

import App from './App'

export default connect(
  state => {
    const Component = pages[state.router.screen.component]
    const props = state.router.screen.props

    return {
      children: <Component {...props} />
    }
  }
)(App)
