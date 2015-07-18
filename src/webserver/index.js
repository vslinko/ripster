import express from 'express'
import morgan from 'morgan'
import proxy from 'express-http-proxy'
import cookieParser from 'cookie-parser'

import React from 'react'
import {renderToString} from 'react-dom/server'
import template from './template'

import Router from 'react-router'
import Location from 'react-router/lib/Location'
import routes from '../shared/routes'

import createStore from '../shared/createStore'
import {Provider} from 'react-redux'
import {loadLocale} from '../shared/flux/locale/localeActions'

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

app.get('*', (req, res) => {
  const locale = getLocale(req)
  const location = new Location(req.path, req.query)

  Router.run(routes, location, async (error, initialState) => {
    if (error) {
      return res.status(500).send()
    }
    if (!initialState) {
      return res.status(404).send()
    }

    const title = 'App'
    const initialData = {}

    try {
      const store = createStore()

      await store.dispatch(loadLocale(locale))

      const html = renderToString(
        <Provider store={store}>
          {() => (
            <Router {...initialState} />
          )}
        </Provider>
      )

      initialData.store = store.getState()

      res.send(template(title, html, initialData))
    } catch (e) {
      console.log(e.stack) // eslint-disable-line no-console
      return res.status(500).send()
    }
  })
})

export default app
