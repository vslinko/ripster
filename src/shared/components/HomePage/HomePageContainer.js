import React from 'react'
import {connect} from 'react-redux'
import {createFormatters} from '../../utils/intl'
import queries from '../../utils/queries'

import {LocaleButtonsContainer} from '../LocaleButtons'
import {SignInFormContainer} from '../SignInForm'
import {UserProfileContainer} from '../UserProfile'
import HomePage from './HomePage'

@queries({
  me: `
    {
      me {
        ... on ${UserProfileContainer.queries.user}
      }
    }
  `
})
@connect(state => ({
  ...createFormatters(state.locale.locale, state.locale.localeData)
}))
export default class HomePageContainer {
  render() {
    return (
      <HomePage {...this.props}>

        <LocaleButtonsContainer key="localeButtons" />

        <SignInFormContainer key="form" />

        <UserProfileContainer key="currentUser" user={this.props.me} />

      </HomePage>
    )
  }
}
