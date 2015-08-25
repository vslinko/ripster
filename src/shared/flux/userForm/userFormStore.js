import createStore from '../../utils/createStore'
import userFormValidator from './userFormValidator'

import {
  USER_FORM_EMAIL_CHANGE,
  USER_FORM_VALIDATION_MESSAGES_VISIBLE,
  USER_FORM_ERROR,
  USER_FORM_DISABLED,
  USER_FORM_INIT
} from './userFormConstants'

const initialState = {}

function mergeForm(state, id, changes) {
  const form = {
    ...state[id].form,
    ...changes
  }
  const validation = userFormValidator(form)

  return {
    ...state,
    [id]: {
      ...state[id],
      form,
      validation
    }
  }
}

function init(state, {id, email}) {
  const initialForm = {
    email
  }

  const initialFormState = {
    form: initialForm,
    initialForm,
    validationMessagesVisible: false,
    validation: userFormValidator(initialForm),
    error: undefined,
    disabled: false
  }

  return {
    ...state,
    [id]: initialFormState
  }
}

function email(state, {id, email}) {
  return mergeForm(state, id, {email})
}

function validationMessagesVisible(state, {id, visible}) {
  return {
    ...state,
    [id]: {
      ...state[id],
      validationMessagesVisible: visible
    }
  }
}

function error(state, {id, error}) {
  return {
    ...state,
    [id]: {
      ...state[id],
      error: error && error.message ? error.message : error
    }
  }
}

function disabled(state, {id, disabled}) {
  return {
    ...state,
    [id]: {
      ...state[id],
      disabled
    }
  }
}

export default createStore(initialState, {
  [USER_FORM_INIT]: init,
  [USER_FORM_EMAIL_CHANGE]: email,
  [USER_FORM_VALIDATION_MESSAGES_VISIBLE]: validationMessagesVisible,
  [USER_FORM_ERROR]: error,
  [USER_FORM_DISABLED]: disabled
})
