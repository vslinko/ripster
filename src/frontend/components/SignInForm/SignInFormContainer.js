import {compose} from 'redux';
import {connect} from 'react-redux';
import {connectReduxForm} from 'redux-form';
import {gettext} from '../../utils/gettext';
import wrapValidate from '../../utils/wrapValidate';

import {authorize} from '../../flux/user';
import validate from './signInFormValidator';

import SignInForm from './SignInForm';

export default compose(
  connect(
    state => ({
      gettext: gettext(state.locale.messages),
    }),
    {
      onSubmit: authorize,
    }
  ),
  connectReduxForm({
    form: 'SignInForm',
    fields: ['email', 'password'],
    validate: wrapValidate(validate),
  })
)(SignInForm);
