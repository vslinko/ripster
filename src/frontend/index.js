import React from 'react'
import {render} from 'react-dom'

import Router from 'react-router'
import {history as browserHistory} from 'react-router/lib/BrowserHistory'
import {history as hashHistory} from 'react-router/lib/HashHistory'
import routes from '../shared/routes'

import createStore from '../shared/createStore'
import {Provider} from 'react-redux'

const history = process.env.NODE_ENV === 'test'
  ? hashHistory
  : browserHistory

function initApp() {
  const store = createStore(window.state.store)

  render(
    <Provider store={store}>
      {() => (
        <Router history={history} children={routes} />
      )}
    </Provider>,
    document.getElementById('app')
  )
}

initApp()
