import express from 'express'
import morgan from 'morgan'
import proxy from 'express-http-proxy'

import React from 'react'
import {renderToString} from 'react-dom/server'
import template from './template'

import Router from 'react-router'
import Location from 'react-router/lib/Location'
import routes from '../shared/routes'

import createStore from '../shared/createStore'
import {Provider} from 'react-redux'

const app = express()

app.disable('x-powered-by')
app.use(morgan('combined'))

if (process.env.PUBLIC_DIR) {
  app.use(express.static(process.env.PUBLIC_DIR, {
    index: false
  }))
}

if (process.env.GRAPHQL_URL) {
  app.use('/_graphql', proxy(process.env.GRAPHQL_URL))
}

app.get('*', (req, res) => {
  const location = new Location(req.path, req.query)

  Router.run(routes, location, (error, initialState) => {
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
