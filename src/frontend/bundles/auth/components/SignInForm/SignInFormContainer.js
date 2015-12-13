import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { injectIntl } from 'react-intl';
import schemaToAsyncValidator from 'frontend/utils/schemaToAsyncValidator';

import { authorize } from '../../actionCreators';
import signInFormSchema from './../../schemas/signInFormSchema';

import SignInForm from './SignInForm';

export default compose(
  connect(
    null,
    {
      onSubmit: authorize,
    }
  ),
  reduxForm({
    form: 'SignInForm',
    fields: ['email', 'password'],
    asyncValidate: schemaToAsyncValidator(() => signInFormSchema),
  }),
  injectIntl
)(SignInForm);
