import React from 'react'
import {connect} from 'react-redux'
import {createFormatters} from '../../utils/intl'

import {LocaleButtonsContainer} from '../LocaleButtons'
import {SignInFormContainer} from '../SignInForm'
import {UserInfoContainer} from '../UserInfo'
import HomePage from './HomePage'

const HomePageFlux = connect(
  state => ({
    ...createFormatters(state.locale.locale, state.locale.localeData)
  }),
  null,
  (stateProps, dispatchProps, parentProps) => ({
    ...stateProps,
    children: [
      <LocaleButtonsContainer key="localeButtons" />,
      <SignInFormContainer key="form" />,
      <div key="users">
        {parentProps.users.users.edges.map((edge) => (
          <UserInfoContainer key={edge.cursor} user={edge.node} />
        ))}
      </div>
    ]
  })
)(HomePage)

import Relay from 'react-relay'

export default Relay.createContainer(HomePageFlux, {
  fragments: {
    users: () => Relay.QL`
      fragment on Viewer {
        users(first: 10) {
          edges {
            cursor
            node {
              ${UserInfoContainer.getFragment('user')}
            }
          }
        }
      }
    `
  }
})
