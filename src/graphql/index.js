import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import passport from 'passport'
import BearerStrategy from 'passport-http-bearer'
import AnonymousStrategy from 'passport-anonymous'

import {graphql} from 'graphql'
import schema from './schema'

import getUserByToken from './queries/user/getUserByToken'

passport.use(new AnonymousStrategy())
passport.use(new BearerStrategy(
  async (token, cb) => {
    try {
      cb(undefined, await getUserByToken(token))
    } catch (err) {
      cb(err)
    }
  }
))

const app = express()

app.disable('x-powered-by')
app.use(morgan('combined'))
app.use(bodyParser.text())
app.use(passport.authenticate(['bearer', 'anonymous'], {
  session: false
}))

app.post('/', async (req, res) => {
  const {body, user} = req
  const result = await graphql(schema, body, {user})

  res.set('Access-Control-Allow-Origin', '*')
  res.send(result)
})

export default app
