import Intl from 'intl';
import {createSelector} from 'reselect';

function createDateFormatter(locale, localeData) {
  Intl.__addLocaleData(localeData);
  return (date) => {
    return new Intl.DateTimeFormat(locale).format(date);
  };
}

function createNumberFormatter(locale, localeData) {
  Intl.__addLocaleData(localeData);
  return (number) => {
    return new Intl.NumberFormat(locale, {style: 'decimal'}).format(number);
  };
}

function createCurrencyFormatter(locale, localeData) {
  Intl.__addLocaleData(localeData);
  return (number, currency) => {
    return new Intl.NumberFormat(locale, {style: 'currency', currency}).format(number);
  };
}

const localeSelector = state => state.locale;

export default createSelector(
  [localeSelector],
  ({locale, localeData}) => ({
    formatDate: createDateFormatter(locale, localeData),
    formatCurrency: createCurrencyFormatter(locale, localeData),
    formatNumber: createNumberFormatter(locale, localeData),
  })
);
