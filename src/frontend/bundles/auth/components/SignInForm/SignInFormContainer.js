import {compose} from 'redux';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import gettextSelector from 'frontend/bundles/locale/selectors/gettextSelector';
import schemaToAsyncValidator from 'frontend/utils/schemaToAsyncValidator';

import {authorize} from '../../actionCreators';
import signInFormSchema from './../../schemas/signInFormSchema';

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
    asyncValidate: schemaToAsyncValidator(() => signInFormSchema),
  })
)(SignInForm);
