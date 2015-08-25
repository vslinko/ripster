import SetEmailMutation from '../../relay/mutations/SetEmailMutation'
import applyMutation from '../../utils/applyMutation'

import {
  USER_FORM_EMAIL_CHANGE,
  USER_FORM_VALIDATION_MESSAGES_VISIBLE,
  USER_FORM_ERROR,
  USER_FORM_DISABLED,
  USER_FORM_INIT
} from './userFormConstants'

let globalId = 0

export function init(email) {
  return dispatch => {
    const id = globalId++

    dispatch({
      type: USER_FORM_INIT,
      id,
      email
    })

    return id
  }
}

export function setEmail(id, email) {
  return {
    type: USER_FORM_EMAIL_CHANGE,
    id,
    email
  }
}

export function setValidationMessagesVisible(id, visible) {
  return {
    type: USER_FORM_VALIDATION_MESSAGES_VISIBLE,
    id,
    visible
  }
}

export function setError(id, error) {
  return {
    type: USER_FORM_ERROR,
    id,
    error
  }
}

export function setDisabled(id, disabled) {
  return {
    type: USER_FORM_DISABLED,
    id,
    disabled
  }
}

export function submit(id, user) {
  return async (dispatch, getState) => {
    const {userForm} = getState()
    const {disabled, validation: {valid}, form} = userForm[id]
    const {email} = form

    if (disabled) {
      return
    }

    if (!valid) {
      dispatch(setValidationMessagesVisible(id, true))
      return
    }

    dispatch(setDisabled(id, true))
    dispatch(setError(id, undefined))
    dispatch(setValidationMessagesVisible(id, false))

    try {
      await applyMutation(new SetEmailMutation({
        user,
        email
      }))
    } catch (error) {
      dispatch(setError(id, error.message))
    } finally {
      dispatch(setDisabled(id, false))
    }
  }
}
