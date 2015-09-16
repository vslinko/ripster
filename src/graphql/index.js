import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import BearerStrategy from 'passport-http-bearer';
import AnonymousStrategy from 'passport-anonymous';
import cookieParser from 'cookie-parser';
import graphqlHTTP from 'express-graphql';

import schema from './schema';

import getUserByToken from './queries/user/getUserByToken';

passport.use(new AnonymousStrategy());
passport.use(new BearerStrategy(
  async (token, cb) => {
    try {
      cb(undefined, await getUserByToken(token));
    } catch (err) {
      cb(err);
    }
  }
));

const app = express();

app.disable('x-powered-by');
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cookieParser());
app.use(passport.authenticate(['bearer', 'anonymous'], {
  session: false,
}));

app.use(graphqlHTTP(request => ({
  schema,
  rootValue: {
    locale: request.cookies.locale || 'en',
    user: request.user,
  },
})));

export default app;
