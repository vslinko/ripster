import Intl from 'intl';
import {createAction} from 'redux-act';
import cookie from 'cookie';

function loadRussian(cb) {
  if (Intl.__addLocaleData) {
    require.ensure(['locale/ru.json', 'intl/locale-data/json/ru.json'], (require) => {
      Intl.__addLocaleData(require('intl/locale-data/json/ru.json'));
      cb(require('locale/ru.json'));
    });
  } else {
    require.ensure(['locale/ru.json'], (require) => {
      cb(require('locale/ru.json'));
    });
  }
}

function loadEnglish(cb) {
  if (Intl.__addLocaleData) {
    require.ensure(['locale/en.json', 'intl/locale-data/json/en.json'], (require) => {
      Intl.__addLocaleData(require('intl/locale-data/json/en.json'));
      cb(require('locale/en.json'));
    });
  } else {
    require.ensure(['locale/en.json'], (require) => {
      cb(require('locale/en.json'));
    });
  }
}

export const setLocaleMessages = createAction('setLocaleMessages');
export const setLocale = createAction('setLocale', (locale) => {
  document.cookie = `locale=${locale}; path=/`;
  return locale;
});

export function loadLocale(locale) {
  return dispatch => {
    return new Promise(resolve => {
      let loader;

      switch (locale) {
      case 'ru':
        loader = loadRussian;
        break;
      default:
        loader = loadEnglish;
      }

      loader((messages) => {
        dispatch(setLocaleMessages(messages));
        dispatch(setLocale(locale));
        resolve();
      });
    });
  };
}

export function loadCurrentLocale() {
  return (dispatch) => {
    const cookies = cookie.parse(document.cookie);
    const locale = cookies.locale || 'en';

    dispatch(loadLocale(locale));
  };
}

export function init() {
  return (dispatch) => {
    dispatch(loadCurrentLocale());
  };
}
