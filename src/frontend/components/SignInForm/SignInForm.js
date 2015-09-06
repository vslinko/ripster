import React, {PropTypes} from 'react';
import preventEvent from '../../utils/preventEvent';
import testDecorator from '../../utils/testDecorator';

@testDecorator()
export default class SignInForm {
  static propTypes = {
    markTestElement: PropTypes.func.isRequired,
    gettext: PropTypes.func.isRequired,

    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    emailError: PropTypes.string,
    passwordError: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.string,

    onEmailChange: PropTypes.func.isRequired,
    onPasswordChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  render() {
    const {
      markTestElement,
      gettext,

      email,
      password,
      emailError,
      passwordError,
      disabled,
      error,

      onEmailChange,
      onPasswordChange,
      onSubmit,
    } = this.props;

    return (
      <form onSubmit={preventEvent(onSubmit)}>
        <div>
          <label htmlFor="SignInForm-Email">{gettext('Email')}</label>
          <input
            {...markTestElement('Email')}
            type="email"
            id="SignInForm-Email"
            placeholder={gettext('Email')}
            value={email}
            onChange={event => onEmailChange(event.target.value)}
            disabled={disabled}
          />
          {emailError && <span>{emailError}</span>}
        </div>
        <div>
          <label htmlFor="SignInForm-Password">{gettext('Password')}</label>
          <input
            {...markTestElement('Password')}
            type="password"
            id="SignInForm-Password"
            placeholder={gettext('Password')}
            value={password}
            onChange={event => onPasswordChange(event.target.value)}
            disabled={disabled}
          />
          {passwordError && <span>{passwordError}</span>}
        </div>
        <button disabled={disabled}>{gettext('Submit')}</button>
        {error && <p>{error}</p>}
      </form>
    );
  }
}
