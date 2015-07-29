/* eslint-disable no-underscore-dangle */

import Intl from 'intl'

export function createDateFormatter(locale, localeData) {
  Intl.__addLocaleData(localeData)
  return (date) => {
    return new Intl.DateTimeFormat(locale).format(date)
  }
}

export function createNumberFormatter(locale, localeData) {
  Intl.__addLocaleData(localeData)
  return (number) => {
    return new Intl.NumberFormat(locale, {style: 'decimal'}).format(number)
  }
}

export function createCurrencyFormatter(locale, localeData) {
  Intl.__addLocaleData(localeData)
  return (number, currency) => {
    return new Intl.NumberFormat(locale, {style: 'currency', currency}).format(number)
  }
}

export function createFormatters(locale, localeData) {
  return {
    formatDate: createDateFormatter(locale, localeData),
    formatCurrency: createCurrencyFormatter(locale, localeData),
    formatNumber: createNumberFormatter(locale, localeData)
  }
}
