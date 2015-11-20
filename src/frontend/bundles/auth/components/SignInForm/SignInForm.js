import React, {PropTypes} from 'react';
import {defineMessages} from 'react-intl';
import testable from 'frontend/utils/testable';

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

@testable()
export default class SignInForm extends React.Component {
  static propTypes = {
    markTestElement: PropTypes.func.isRequired,
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
      markTestElement,

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
      <form onSubmit={handleSubmit} {...markTestElement('Form')}>
        <div>
          <label htmlFor="SignInForm-Email">
            {formatMessage(messages.email)}
          </label>
          <input
            {...markTestElement('Email')}
            type="email"
            id="SignInForm-Email"
            placeholder={formatMessage(messages.email)}
            {...email}
            disabled={submitting}
          />
          {email.error && email.touched && <span {...markTestElement('EmailError')}>{email.error}</span>}
        </div>
        <div>
          <label htmlFor="SignInForm-Password">{formatMessage(messages.password)}</label>
          <input
            {...markTestElement('Password')}
            type="password"
            id="SignInForm-Password"
            placeholder={formatMessage(messages.password)}
            {...password}
            disabled={submitting}
          />
          {password.error && password.touched && <span {...markTestElement('PasswordError')}>{password.error}</span>}
        </div>
        <button disabled={submitting} {...markTestElement('Button')}>{formatMessage(messages.submit)}</button>
      </form>
    );
  }
}
