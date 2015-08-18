import express from 'express'
import morgan from 'morgan'
import proxy from 'express-http-proxy'
import cookieParser from 'cookie-parser'

import React from 'react'
import {renderToString} from 'react-dom/server'
import template from './template'

import {createMemoryHistory} from 'history'

import createStore from '../shared/createStore'
import createRouter from '../shared/createRouter'
import {Provider} from 'react-redux'
import {setToken} from '../shared/flux/token/tokenActions'
import {loadLocale} from '../shared/flux/locale/localeActions'
import {shrinkData} from '../shared/flux/app/appActions'

import {AppContainer} from '../shared/components/App'

const app = express()

app.disable('x-powered-by')
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(cookieParser())

if (process.env.PUBLIC_DIR) {
  app.use(express.static(process.env.PUBLIC_DIR, {
    index: false
  }))
}

if (process.env.GRAPHQL_URL) {
  app.use('/_graphql', proxy(process.env.GRAPHQL_URL))
}

function getLocale(req) {
  const knownLocales = ['en', 'ru']

  if (req.cookies && knownLocales.indexOf(req.cookies.locale) >= 0) {
    return req.cookies.locale
  }

  return req.acceptsLanguages(...knownLocales) || knownLocales[0]
}

app.get('*', async (req, res) => {
  try {
    const locale = getLocale(req)

    const history = createMemoryHistory(req.originalUrl)
    const store = createStore(history)

    if (req.cookies.token) {
      await store.dispatch(setToken(req.cookies.token))
    }
    await store.dispatch(loadLocale(locale))

    const router = createRouter(history, store)

    await router.waitQueue()

    const html = renderToString(
      <Provider store={store}>
        {() => <AppContainer />}
      </Provider>
    )

    const {title, status} = store.getState().router.screen

    await store.dispatch(shrinkData())

    const initialData = store.getState()

    res.status(status || 200)
    res.send(template(title, html, initialData))

  } catch (err) {
    console.log(err.stack) // eslint-disable-line no-console

    res.status(500)
    res.set('Content-Type', 'text/plain')
    res.send(err.stack)
  }
})

export default app
