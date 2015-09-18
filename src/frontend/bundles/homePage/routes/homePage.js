import Relay from 'react-relay';
import {HomePageContainer} from '../components/HomePage';

export default {
  path: '/',
  component: HomePageContainer,
  queries: {
    viewer: () => Relay.QL`query {viewer}`,
  },
};
