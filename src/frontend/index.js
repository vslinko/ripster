import React from 'react'
import {render} from 'react-dom'

import {createHistory} from 'history'
import createStore from '../shared/createStore'
import createRouter from '../shared/createRouter'

import {Provider} from 'react-redux'

import {AppContainer} from '../shared/components/App'

import {loadCurrentLocale} from '../shared/flux/locale/localeActions'
import {readToken} from '../shared/flux/token/tokenActions'

async function initApp() {
  try {
    const history = createHistory()
    const store = createStore(history)

    await* [
      store.dispatch(loadCurrentLocale()),
      store.dispatch(readToken())
    ]

    const router = createRouter(history, store)

    await router.waitQueue()

    render(
      <Provider store={store}>
        <AppContainer />
      </Provider>,
      document.getElementById('app')
    )

  } catch (err) {
    console.log(err.stack) // eslint-disable-line no-console
  }
}

initApp()
