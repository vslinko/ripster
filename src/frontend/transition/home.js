import React from 'react';
import Relay from 'react-relay';
import {createTransition} from 'vstack-router';
import {HomePageContainer} from 'frontend/components/HomePage';
import ViewerRoute from './ViewerRoute';

export default createTransition('/', () => {
  return (
    <Relay.RootContainer
      Component={HomePageContainer}
      route={new ViewerRoute()}
    />
  );
});
