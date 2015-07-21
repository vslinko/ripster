import React, {PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {gettext} from '../../utils/gettext'
import {formData} from '../../utils/formHelpers'

import {
  setEmail,
  setPassword,
  submit
} from '../../flux/signInForm/signInFormActions'

import SignInForm from './SignInForm'

@connect(state => ({
  ...formData(state.signInForm),
  gettext: gettext(state.locale.messages)
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
