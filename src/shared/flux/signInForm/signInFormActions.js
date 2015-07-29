import {
  SIGN_IN_FORM_EMAIL_CHANGE,
  SIGN_IN_FORM_PASSWORD_CHANGE,
  SIGN_IN_FORM_VALIDATION_MESSAGES_VISIBLE,
  SIGN_IN_FORM_ERROR,
  SIGN_IN_FORM_DISABLED,
  SIGN_IN_FORM_RESET
} from './signInFormConstants'

import {authorize} from '../user/userActions'

export function setEmail(email) {
  return {
    type: SIGN_IN_FORM_EMAIL_CHANGE,
    email
  }
}

export function setPassword(password) {
  return {
    type: SIGN_IN_FORM_PASSWORD_CHANGE,
    password
  }
}

export function setValidationMessagesVisible(visible) {
  return {
    type: SIGN_IN_FORM_VALIDATION_MESSAGES_VISIBLE,
    visible
  }
}

export function setError(error) {
  return {
    type: SIGN_IN_FORM_ERROR,
    error
  }
}

export function setDisabled(disabled) {
  return {
    type: SIGN_IN_FORM_DISABLED,
    disabled
  }
}

export function reset() {
  return {
    type: SIGN_IN_FORM_RESET
  }
}

export function submit() {
  return async (dispatch, getState) => {
    const {signInForm} = getState()
    const {disabled, validation: {valid}, form} = signInForm
    const {email, password} = form

    if (disabled) {
      return
    }

    if (!valid) {
      dispatch(setValidationMessagesVisible(true))
      return
    }

    dispatch(setDisabled(true))
    dispatch(setError(undefined))
    dispatch(setValidationMessagesVisible(false))

    try {
      await dispatch(authorize(email, password))
      dispatch(reset())
    } catch (error) {
      dispatch(setError(error))
    } finally {
      dispatch(setDisabled(false))
    }
  }
}
