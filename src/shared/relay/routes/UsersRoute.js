import Relay from 'react-relay'

export default class UsersRoute extends Relay.Route {
  static routeName = 'UsersRoute'

  static queries = {
    users: Component => Relay.QL`
      query {
        viewer {
          ${Component.getFragment('users')}
        }
      }
    `
  }
}
