import createStore from '../../utils/createStore';
import signInFormValidator from './signInFormValidator';

import {
  SIGN_IN_FORM_EMAIL_CHANGE,
  SIGN_IN_FORM_PASSWORD_CHANGE,
  SIGN_IN_FORM_VALIDATION_MESSAGES_VISIBLE,
  SIGN_IN_FORM_ERROR,
  SIGN_IN_FORM_DISABLED,
  SIGN_IN_FORM_RESET,
} from './signInFormConstants';

const initialForm = {
  email: '',
  password: '',
};

const initialState = {
  form: initialForm,
  validationMessagesVisible: false,
  validation: signInFormValidator(initialForm),
  error: undefined,
  disabled: false,
};

function mergeForm(state, changes) {
  const form = {
    ...state.form,
    ...changes,
  };
  const validation = signInFormValidator(form);

  return {
    ...state,
    form,
    validation,
  };
}

function emailHandler(state, {email}) {
  return mergeForm(state, {email});
}

function passwordHandler(state, {password}) {
  return mergeForm(state, {password});
}

function validationMessagesVisibleHandler(state, {visible}) {
  return {
    ...state,
    validationMessagesVisible: visible,
  };
}

function errorHandler(state, {error}) {
  return {
    ...state,
    error: error && error.message,
  };
}

function disabledHandler(state, {disabled}) {
  return {
    ...state,
    disabled,
  };
}

export default createStore(initialState, {
  [SIGN_IN_FORM_EMAIL_CHANGE]: emailHandler,
  [SIGN_IN_FORM_PASSWORD_CHANGE]: passwordHandler,
  [SIGN_IN_FORM_VALIDATION_MESSAGES_VISIBLE]: validationMessagesVisibleHandler,
  [SIGN_IN_FORM_ERROR]: errorHandler,
  [SIGN_IN_FORM_DISABLED]: disabledHandler,
  [SIGN_IN_FORM_RESET]: () => initialState,
});
