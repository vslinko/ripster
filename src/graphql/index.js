import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import {graphql} from 'graphql'
import schema from './schema'

const app = express()

app.disable('x-powered-by')
app.use(morgan('combined'))
app.use(bodyParser.text())

app.post('/', async (req, res) => {
  const query = req.body
  const body = await graphql(schema, query)

  res.set('Access-Control-Allow-Origin', '*')
  res.send(body)
})

export default app
