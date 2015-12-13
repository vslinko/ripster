import { createAction } from 'redux-act';
import { addLocaleData } from 'react-intl';
import cookie from 'cookie';

function loadRussian(cb) {
  require.ensure(['locale/ru.json', 'react-intl/lib/locale-data/ru'], (require) => {
    addLocaleData(require('react-intl/lib/locale-data/ru'));
    cb(require('locale/ru.json'));
  });
}

function loadEnglish(cb) {
  require.ensure(['locale/en.json', 'react-intl/lib/locale-data/en'], (require) => {
    addLocaleData(require('react-intl/lib/locale-data/en'));
    cb(require('locale/en.json'));
  });
}

export const setLocale = createAction(({ locale, messages }) => {
  document.cookie = `locale=${locale}; path=/`;
  return { locale, messages };
});

export function loadLocale(locale) {
  return (dispatch) => {
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
        dispatch(setLocale({ locale, messages }));
        resolve();
      });
    });
  };
}

function detectLanguage() {
  const languages = (
    window.navigator.languages || [window.navigator.language || window.navigator.userLanguage || 'en']
  ).map(language => language.toLowerCase());

  if (languages.includes('ru') || languages.includes('ru-ru')) {
    return 'ru';
  }

  return 'en';
}

export function loadCurrentLocale() {
  return async (dispatch) => {
    const cookies = cookie.parse(document.cookie);
    const locale = cookies.locale || detectLanguage();

    await dispatch(loadLocale(locale));
  };
}

export function init() {
  return async (dispatch) => {
    await dispatch(loadCurrentLocale());
  };
}
