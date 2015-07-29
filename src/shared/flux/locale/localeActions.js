import {
  LOCALE,
  LOCALE_DATA,
  LOCALE_MESSAGES
} from './localeConstants'

export function setLocaleMessages(messages) {
  return {
    type: LOCALE_MESSAGES,
    messages
  }
}

export function setLocaleData(localeData) {
  return {
    type: LOCALE_DATA,
    localeData
  }
}

export function setLocale(locale) {
  if (__FRONTEND__) {
    document.cookie = `locale=${locale}; path=/`
  }

  return {
    type: LOCALE,
    locale
  }
}

function loadRussian(cb) {
  require.ensure(['../../../locale/ru.json', 'intl/locale-data/json/ru.json'], (require) => {
    cb(require('../../../locale/ru.json'), require('intl/locale-data/json/ru.json'))
  })
}

function loadEnglish(cb) {
  require.ensure(['../../../locale/en.json', 'intl/locale-data/json/en.json'], (require) => {
    cb(require('../../../locale/en.json'), require('intl/locale-data/json/en.json'))
  })
}

export function loadLocale(locale) {
  return dispatch => {
    new Promise(resolve => {
      let loader

      switch (locale) {
        case 'ru':
          loader = loadRussian
          break
        default:
          loader = loadEnglish
      }

      loader((messages, localeData) => {
        dispatch(setLocale(locale))
        dispatch(setLocaleData(localeData))
        dispatch(setLocaleMessages(messages))
        resolve()
      })
    })
  }
}
