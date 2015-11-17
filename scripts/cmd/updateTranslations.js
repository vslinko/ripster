import {readFileSync, writeFileSync} from 'fs';
import {join} from 'path';
import glob from 'glob';
import {transformFileSync} from 'babel-core';

const componentFilesPattern = join(
  __dirname, '..', '..', 'src', 'frontend', 'bundles', '*', 'components', '*', '*.js'
);
const localeFilesPattern = join(
  __dirname, '..', '..', 'src', 'locale', '*.json'
);

const babelOptions = {
  stage: 0,
  plugins: ['react-intl'],
};

const componentFiles = glob.sync(componentFilesPattern);
const localeFiles = glob.sync(localeFilesPattern);

const messages = componentFiles
  .map((file) => ({
    file,
    babel: transformFileSync(file, babelOptions),
  }))
  .filter(result => result.babel.metadata['react-intl'])
  .reduce((acc, result) => {
    result.babel.metadata['react-intl'].messages.forEach((message) => {
      if (acc[message.id]) {
        throw new Error(`Duplicate message id "${message.id}" in "${result.file}"`);
      }

      acc[message.id] = message.defaultMessage;
    });

    return acc;
  }, {});

localeFiles.forEach((file) => {
  const locale = Object.assign(
    {},
    messages,
    JSON.parse(readFileSync(file).toString())
  );

  writeFileSync(file, JSON.stringify(locale, null, 2) + '\n');
});
