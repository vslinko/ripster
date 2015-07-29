import React from 'react'
import {render} from 'react-dom'

import {createHistory} from 'history'
import createApp from '../shared/createApp'

import {Provider} from 'react-redux'

import {AppContainer} from '../shared/components/App'

async function initApp() {
  try {
    const history = createHistory()
    const {router, store} = createApp(history, window.state)

    await router.waitQueue()

    render(
      <Provider store={store}>
        {() => <AppContainer />}
      </Provider>,
      document.getElementById('app')
    )

  } catch (err) {
    console.log(err.stack) // eslint-disable-line no-console
  }
}

initApp()
