import React from 'react';
import Relay from 'react-relay';
import {HomePageContainer} from '../../components/HomePage';
import ViewerRoute from '../../relay/routes/ViewerRoute';

export function homeTransition() {
  return () => {
    return (
      <Relay.RootContainer
        Component={HomePageContainer}
        route={new ViewerRoute()}
      />
    );
  };
}
