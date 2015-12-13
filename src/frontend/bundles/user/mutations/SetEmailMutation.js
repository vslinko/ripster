import Relay from 'react-relay';

export default class SetEmailMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  }

  getMutation() {
    return Relay.QL`mutation {setEmail}`;
  }

  getVariables() {
    return {
      id: this.props.user.id,
      email: this.props.email,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on SetEmailPayload {
        user {
          email
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.user.id,
      },
    }];
  }

  getCollisionKey() {
    return `setEmail_${this.props.user.id}`;
  }
}
