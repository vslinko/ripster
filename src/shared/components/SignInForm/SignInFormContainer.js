import {connect} from 'react-redux';
import {gettext} from '../../utils/gettext';
import {formData} from '../../utils/formHelpers';

import {
  setEmail,
  setPassword,
  submit,
} from '../../flux/signInForm/signInFormActions';

import SignInForm from './SignInForm';

export default connect(
  state => ({
    ...formData(state.signInForm),
    gettext: gettext(state.locale.messages),
  }),
  {
    onEmailChange: setEmail,
    onPasswordChange: setPassword,
    onSubmit: submit,
  }
)(SignInForm);
