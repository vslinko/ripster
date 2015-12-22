import { App } from 'frontend/bundles/common/components/App';

const req = require.context(
  'frontend/bundles',
  true,
  /^\.\/[a-z]+\/routes\/[a-z]+\.js$/i
);

export default [
  {
    component: App,
    childRoutes: req.keys().map(key => req(key).default),
  },
];
