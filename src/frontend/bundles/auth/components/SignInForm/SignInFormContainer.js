import {compose} from 'redux';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import gettextSelector from 'frontend/bundles/locale/selectors/gettextSelector';
import wrapValidate from 'frontend/utils/wrapValidate';

import {authorize} from '../../actionCreators';
import validate from './../../validators/signInFormValidator';

import SignInForm from './SignInForm';

export default compose(
  connect(
    gettextSelector,
    {
      onSubmit: authorize,
    }
  ),
  reduxForm({
    form: 'SignInForm',
    fields: ['email', 'password'],
    validate: wrapValidate(validate),
  })
)(SignInForm);
