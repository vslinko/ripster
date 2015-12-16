import 'source-map-support/register';
import 'babel/polyfill';

const req = require.context(
  '../graphql',
  true,
  /Test\.js$/
);

const allowedFiles = process.env.UNIT_TESTS
  ? process.env.UNIT_TESTS.split('#')
  : [];

req.keys().forEach((file) => {
  const filePath = file.replace(/^\.\//, '');

  if (allowedFiles.length === 0 || allowedFiles.indexOf(filePath) >= 0) {
    req(file);
  }
});
