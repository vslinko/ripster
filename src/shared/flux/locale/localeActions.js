import {
  LOCALE,
  LOCALE_MESSAGES
} from './localeConstants'

export function setLocaleMessages(messages) {
  return {
    type: LOCALE_MESSAGES,
    messages
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
  require.ensure('../../../locale/ru.json', (require) => {
    cb(require('../../../locale/ru.json'))
  })
}

function loadEnglish(cb) {
  require.ensure('../../../locale/en.json', (require) => {
    cb(require('../../../locale/en.json'))
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

      loader(messages => {
        dispatch(setLocale(locale))
        dispatch(setLocaleMessages(messages))
        resolve()
      })
    })
  }
}
