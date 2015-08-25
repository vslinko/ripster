import React from 'react'
import Relay from 'react-relay'
import {HomePageContainer} from '../../components/HomePage'
import UsersRoute from '../../relay/routes/UsersRoute'

export function homeTransition() {
  return () => {
    return (
      <Relay.RootContainer
        Component={HomePageContainer}
        route={new UsersRoute()}
      />
    )
  }
}
