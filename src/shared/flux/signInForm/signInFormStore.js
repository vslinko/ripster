import createStore from '../../utils/createStore'
import signInFormValidator from './signInFormValidator'

import {
  APP_SHRINK_DATA,
  APP_STRETCH_DATA
} from '../app/appConstants'

import {
  SIGN_IN_FORM_EMAIL_CHANGE,
  SIGN_IN_FORM_PASSWORD_CHANGE,
  SIGN_IN_FORM_VALIDATION_MESSAGES_VISIBLE,
  SIGN_IN_FORM_ERROR,
  SIGN_IN_FORM_DISABLED,
  SIGN_IN_FORM_RESET
} from './signInFormConstants'

const initialForm = {
  email: '',
  password: ''
}

const initialState = {
  form: initialForm,
  validationMessagesVisible: false,
  validation: signInFormValidator(initialForm),
  error: undefined,
  disabled: false
}

function mergeForm(state, changes) {
  const form = {
    ...state.form,
    ...changes
  }
  const validation = signInFormValidator(form)

  return {
    ...state,
    form,
    validation
  }
}

function email(state, {email}) {
  return mergeForm(state, {email})
}

function password(state, {password}) {
  return mergeForm(state, {password})
}

function validationMessagesVisible(state, {visible}) {
  return {
    ...state,
    validationMessagesVisible: visible
  }
}

function error(state, {error}) {
  return {
    ...state,
    error: error && error.message
  }
}

function disabled(state, {disabled}) {
  return {
    ...state,
    disabled
  }
}

export default createStore(initialState, {
  [SIGN_IN_FORM_EMAIL_CHANGE]: email,
  [SIGN_IN_FORM_PASSWORD_CHANGE]: password,
  [SIGN_IN_FORM_VALIDATION_MESSAGES_VISIBLE]: validationMessagesVisible,
  [SIGN_IN_FORM_ERROR]: error,
  [SIGN_IN_FORM_DISABLED]: disabled,
  [SIGN_IN_FORM_RESET]: () => initialState,

  [APP_SHRINK_DATA]: (state) => ({
    ...state,
    validation: undefined
  }),
  [APP_STRETCH_DATA]: (state) => ({
    ...state,
    validation: signInFormValidator(state.form)
  })
})
