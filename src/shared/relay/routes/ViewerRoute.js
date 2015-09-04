import Relay from 'react-relay'

export default class ViewerRoute extends Relay.Route {
  static routeName = 'ViewerRoute'

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
