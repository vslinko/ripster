import {compose} from 'redux';
import {connect} from 'react-redux';
import {IntlProvider} from 'react-intl';

export default compose(
  connect(
    state => ({
      ...state.locale,
      key: state.locale.locale,
    })
  )
)(IntlProvider);
