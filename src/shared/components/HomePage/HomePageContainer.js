import React from 'react'
import {connect} from 'react-redux'
import {createFormatters} from '../../utils/intl'

import {LocaleButtonsContainer} from '../LocaleButtons'
import {SignInFormContainer} from '../SignInForm'
import HomePage from './HomePage'

export default connect(
  state => ({
    ...createFormatters(state.locale.locale, state.locale.localeData),
    children: [
      <LocaleButtonsContainer key="localeButtons" />,
      <SignInFormContainer key="form" />
    ]
  })
)(HomePage)
