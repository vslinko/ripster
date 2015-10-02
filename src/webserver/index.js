import express from 'express';
import morgan from 'morgan';
import proxy from 'express-http-proxy';
import cookieParser from 'cookie-parser';
import cookie from 'cookie';

import template from './template';

const app = express();

app.disable('x-powered-by');
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cookieParser());

if (process.env.PUBLIC_DIR) {
  app.use(express.static(process.env.PUBLIC_DIR, {
    index: false,
  }));
}

app.use('/graphql', proxy(process.env.GRAPHQL_URL, {
  preserveHostHdr: true,
  decorateRequest(req) {
    if (req.headers.cookie) {
      const token = cookie.parse(req.headers.cookie).token;

      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
    }

    return req;
  },
}));

app.get('*', async (req, res) => {
  res.send(template());
});

export default app;
