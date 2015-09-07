import Relay from 'react-relay';

export default class CreateSessionMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation {createSession}`;
  }

  getVariables() {
    return {
      email: this.props.email,
      password: this.props.password,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateSessionPayload {
        session {
          sid
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'REQUIRED_CHILDREN',
      children: [
        Relay.QL`
          fragment on CreateSessionPayload {
            session {
              sid
            }
          }
        `,
      ],
    }];
  }

  getCollisionKey() {
    return `createSession`;
  }
}
