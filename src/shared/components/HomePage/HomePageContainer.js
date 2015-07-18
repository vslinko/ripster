import React from 'react'

import {SignInFormContainer} from '../SignInForm'
import HomePage from './HomePage'

export default class HomePageContainer {
  render() {
    return (
      <HomePage {...this.props}>

        <SignInFormContainer key="form" />

      </HomePage>
    )
  }
}
