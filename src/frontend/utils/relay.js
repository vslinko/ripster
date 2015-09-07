import Relay from 'react-relay';

export default function relay(options) {
  return Component => Relay.createContainer(Component, options);
}
