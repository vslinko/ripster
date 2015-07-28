import React from 'react'
import {connect} from 'react-redux'
import {createFormatters} from '../../utils/intl'

import {LocaleButtonsContainer} from '../LocaleButtons'
import {SignInFormContainer} from '../SignInForm'
import HomePage from './HomePage'

@connect(state => ({
  ...createFormatters(state.locale.locale, state.locale.localeData)
}))
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
