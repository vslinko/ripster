import Relay from 'react-relay';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import relay from 'frontend/utils/relay';

import UserInfo from './UserInfo';

import SetEmailMutation from '../../mutations/SetEmailMutation';
import { setEmail } from '../../actionCreators';

export default compose(
  relay({
    fragments: {
      user: () => Relay.QL`
        fragment on User {
          id
          email
          ${SetEmailMutation.getFragment('user')}
        }
      `,
    },
  }),
  connect(
    null,
    {
      onSubmit: setEmail,
    },
    (stateProps, actionProps, parentProps) => ({
      onSubmit: ({ email }) => actionProps.onSubmit({
        user: parentProps.user,
        email,
      }),
      formKey: parentProps.user.id,
      initialValues: {
        email: parentProps.user.email,
      },
    })
  ),
  reduxForm({
    form: 'UserInfo',
    fields: ['email'],
  })
)(UserInfo);
