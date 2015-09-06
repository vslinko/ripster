import createStore from '../../utils/createStore';
import userFormValidator from './userFormValidator';

import {
  USER_FORM_EMAIL_CHANGE,
  USER_FORM_VALIDATION_MESSAGES_VISIBLE,
  USER_FORM_ERROR,
  USER_FORM_DISABLED,
  USER_FORM_INIT,
} from './userFormConstants';

const initialState = {};

function mergeForm(state, id, changes) {
  const form = {
    ...state[id].form,
    ...changes,
  };
  const validation = userFormValidator(form);

  return {
    ...state,
    [id]: {
      ...state[id],
      form,
      validation,
    },
  };
}

function initHandler(state, {id, email}) {
  const initialForm = {
    email,
  };

  const initialFormState = {
    form: initialForm,
    initialForm,
    validationMessagesVisible: false,
    validation: userFormValidator(initialForm),
    error: undefined,
    disabled: false,
  };

  return {
    ...state,
    [id]: initialFormState,
  };
}

function emailHandler(state, {id, email}) {
  return mergeForm(state, id, {email});
}

function validationMessagesVisibleHandler(state, {id, visible}) {
  return {
    ...state,
    [id]: {
      ...state[id],
      validationMessagesVisible: visible,
    },
  };
}

function errorHandler(state, {id, error}) {
  return {
    ...state,
    [id]: {
      ...state[id],
      error: error && error.message ? error.message : error,
    },
  };
}

function disabledHandler(state, {id, disabled}) {
  return {
    ...state,
    [id]: {
      ...state[id],
      disabled,
    },
  };
}

export default createStore(initialState, {
  [USER_FORM_INIT]: initHandler,
  [USER_FORM_EMAIL_CHANGE]: emailHandler,
  [USER_FORM_VALIDATION_MESSAGES_VISIBLE]: validationMessagesVisibleHandler,
  [USER_FORM_ERROR]: errorHandler,
  [USER_FORM_DISABLED]: disabledHandler,
});
