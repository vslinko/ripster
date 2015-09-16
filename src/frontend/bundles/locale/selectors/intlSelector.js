import Intl from 'intl';
import {createSelector, createStructuredSelector} from 'reselect';

function formatDateSelector(locale) {
  return (date) => {
    return new Intl.DateTimeFormat(locale).format(date);
  };
}

function formatNumberSelector(locale) {
  return (number) => {
    return new Intl.NumberFormat(locale, {style: 'decimal'}).format(number);
  };
}

function formatCurrencySelector(locale) {
  return (number, currency) => {
    return new Intl.NumberFormat(locale, {style: 'currency', currency}).format(number);
  };
}

export default createSelector(
  state => state.locale.locale,
  createStructuredSelector({
    formatDate: formatDateSelector,
    formatCurrency: formatCurrencySelector,
    formatNumber: formatNumberSelector,
  })
);
