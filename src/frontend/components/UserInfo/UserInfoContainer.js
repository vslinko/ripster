import Relay from 'react-relay';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {connectReduxForm} from 'redux-form';
import relay from 'frontend/utils/relay';

import UserInfo from './UserInfo';

import SetEmailMutation from 'frontend/flux/user/SetEmailMutation';
import {setEmail} from 'frontend/flux/user';

export default compose(
  relay({
    fragments: {
      user: () => Relay.QL`
        fragment on User {
          uuid
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
      onSubmit: ({email}) => actionProps.onSubmit({
        user: parentProps.user,
        email,
      }),
      formKey: parentProps.user.uuid,
      initialValues: {
        email: parentProps.user.email,
      },
    })
  ),
  connectReduxForm({
    form: 'UserInfo',
    fields: ['email'],
  })
)(UserInfo);
