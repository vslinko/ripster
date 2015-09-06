import {connect} from 'react-redux';

import {
  loadLocale,
} from '../../flux/locale/localeActions';

import LocaleButtons from './LocaleButtons';

export default connect(
  state => ({
    currentLocale: state.locale.locale,
  }),
  {
    onLocale: loadLocale,
  }
)(LocaleButtons);
