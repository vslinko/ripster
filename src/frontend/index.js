import React from 'react'
import {render} from 'react-dom'

import Router from 'react-router'
import {history} from 'react-router/lib/BrowserHistory'
import routes from '../shared/routes'

import createStore from '../shared/createStore'
import {Provider} from 'react-redux'

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
