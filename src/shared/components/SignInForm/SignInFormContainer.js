import React, {PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {
  setEmail,
  setPassword,
  submit
} from '../../flux/signInForm/signInFormActions'

import SignInForm from './SignInForm'

@connect(state => ({
  ...state.signInForm
}))
export default class SignInFormContainer {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  render() {
    const {dispatch, ...slice} = this.props

    return (
      <SignInForm
        {...slice}
        {...bindActionCreators({
          onEmailChange: setEmail,
          onPasswordChange: setPassword,
          onSubmit: submit
        }, dispatch)}
      />
    )
  }
}
