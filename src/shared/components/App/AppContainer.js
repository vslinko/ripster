import {connect} from 'react-redux'

import App from './App'

export default connect(
  state => ({
    children: state.router.screen
  })
)(App)
