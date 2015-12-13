import React, { PropTypes } from 'react';
import { defineMessages } from 'react-intl';
import { createMarker } from 'frontend/utils/marker';

const messages = defineMessages({
  email: {
    id: 'SignInForm.email',
    defaultMessage: 'Email',
  },
  password: {
    id: 'SignInForm.password',
    defaultMessage: 'Password',
  },
  submit: {
    id: 'SignInForm.submit',
    defaultMessage: 'Submit',
  },
});

const mark = createMarker('SignInForm');

export default class SignInForm extends React.Component {
  static propTypes = {
    fields: PropTypes.shape({
      email: PropTypes.object.isRequired,
      password: PropTypes.object.isRequired,
    }).isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
  }

  render() {
    const {
      intl: {
        formatMessage,
      },

      fields: {
        email,
        password,
      },

      handleSubmit,
      submitting,
    } = this.props;

    return (
      <form onSubmit={handleSubmit} {...mark('Form')}>
        <div>
          <label htmlFor="SignInForm-Email">
            {formatMessage(messages.email)}
          </label>
          <input
            {...mark('Email')}
            type="email"
            id="SignInForm-Email"
            placeholder={formatMessage(messages.email)}
            {...email}
            disabled={submitting}
          />
          {email.error && email.touched && <span {...mark('EmailError')}>{email.error}</span>}
        </div>
        <div>
          <label htmlFor="SignInForm-Password">{formatMessage(messages.password)}</label>
          <input
            {...mark('Password')}
            type="password"
            id="SignInForm-Password"
            placeholder={formatMessage(messages.password)}
            {...password}
            disabled={submitting}
          />
          {password.error && password.touched && <span {...mark('PasswordError')}>{password.error}</span>}
        </div>
        <button disabled={submitting} {...mark('Button')}>{formatMessage(messages.submit)}</button>
      </form>
    );
  }
}
