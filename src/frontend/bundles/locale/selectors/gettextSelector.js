import {createSelector} from 'reselect';
import Jed from 'jed';

function prepareMesages({domain, locale_data: {messages}}) {
  return {
    domain,
    locale_data: {
      messages: Object.keys(messages)
        .reduce((acc, key) => (
          acc[key] = Array.isArray(messages[key])
            ? messages[key].slice(1)
            : messages[key],
          acc
        ), {}),
    },
  };
}

function createGettext(messages) {
  const jed = new Jed(prepareMesages(messages));

  return (message, ...args) => jed.translate(message).fetch(...args);
}

const localeSelector = state => state.locale;

export default createSelector(
  [localeSelector],
  (locale) => ({
    gettext: createGettext(locale.messages),
  })
);
