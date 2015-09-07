import Relay from 'react-relay';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {connectReduxForm} from 'redux-form';
import relay from '../../utils/relay';

import UserInfo from './UserInfo';

import SetEmailMutation from '../../relay/mutations/SetEmailMutation';
import {setEmail} from '../../flux/user/userActions';

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
