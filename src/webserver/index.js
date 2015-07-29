import express from 'express'
import morgan from 'morgan'
import proxy from 'express-http-proxy'
import cookieParser from 'cookie-parser'

import React from 'react'
import {renderToString} from 'react-dom/server'
import template from './template'

import {createMemoryHistory} from 'history'

import createRouter from '../shared/createRouter'

import createStore from '../shared/createStore'
import {Provider} from 'react-redux'
import {loadLocale} from '../shared/flux/locale/localeActions'

import {AppContainer} from '../shared/components/App'

const app = express()

app.disable('x-powered-by')
app.use(morgan('combined'))
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
    const router = createRouter(history)
    const store = createStore(history, router)

    await router.waitQueue()
    await store.dispatch(loadLocale(locale))

    const initialData = store.getState()

    const {title, status} = initialData.router.screen

    const html = renderToString(
      <Provider store={store}>
        {() => <AppContainer />}
      </Provider>
    )

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
