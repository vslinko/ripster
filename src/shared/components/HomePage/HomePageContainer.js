import React from 'react'

import {LocaleButtonsContainer} from '../LocaleButtons'
import {SignInFormContainer} from '../SignInForm'
import HomePage from './HomePage'

export default class HomePageContainer {
  render() {
    return (
      <HomePage {...this.props}>

        <LocaleButtonsContainer key="localeButtons" />

        <SignInFormContainer key="form" />

      </HomePage>
    )
  }
}
