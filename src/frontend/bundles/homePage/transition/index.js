import React from 'react';
import Relay from 'react-relay';
import {createTransition} from 'vstack-router';
import ViewerRoute from 'frontend/ViewerRoute';

import {HomePageContainer} from '../components/HomePage';

export default createTransition('/', () => {
  return (
    <Relay.RootContainer
      Component={HomePageContainer}
      route={new ViewerRoute()}
    />
  );
});
