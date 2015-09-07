import {compose} from 'redux';
import {connect} from 'react-redux';
import {connectReduxForm} from 'redux-form';
import {createGettext} from 'frontend/utils/gettext';
import wrapValidate from 'frontend/utils/wrapValidate';

import {authorize} from '../../actionCreators';
import validate from './../../validators/signInFormValidator';

import SignInForm from './SignInForm';

export default compose(
  connect(
    state => ({
      gettext: createGettext(state.locale.messages),
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
