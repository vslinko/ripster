import React, {PropTypes} from 'react';
import Relay from 'react-relay';
import {connect} from 'react-redux';

import UserInfo from './UserInfo';

import {setEmail, submit, init} from '../../flux/userForm/userFormActions';
import SetEmailMutation from '../../relay/mutations/SetEmailMutation';

@connect(
  state => state.userForm,
  {init, onEmailChange: setEmail, onSubmit: submit},
  (forms, actions, props) => ({
    ...props,
    forms,
    actions,
  })
)
class UserInfoContainer {
  static propTypes = {
    actions: PropTypes.shape({
      init: PropTypes.func.isRequired,
      onEmailChange: PropTypes.func.isRequired,
      onSubmit: PropTypes.func.isRequired,
    }).isRequired,
    user: PropTypes.object.isRequired,
    forms: PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.id = this.props.actions.init(this.props.user.email);
  }

  handleSubmit() {
    this.props.actions.onSubmit(this.id, this.props.user);
  }

  render() {
    const state = this.props.forms[this.id];
    const {actions} = this.props;

    if (!state) {
      return null;
    }

    const wrappedActions = Object.keys(actions)
      .reduce((acc, key) => (
        acc[key] = (...args) => actions[key](this.id, ...args),
        acc
      ), {});

    return (
      <UserInfo
        {...state}
        {...wrappedActions}
        onSubmit={::this.handleSubmit}
      />
    );
  }
}

export default Relay.createContainer(UserInfoContainer, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        uuid
        email
        ${SetEmailMutation.getFragment('user')}
      }
    `,
  },
});
