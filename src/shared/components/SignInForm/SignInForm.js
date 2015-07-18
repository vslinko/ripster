import React, {PropTypes} from 'react'
import preventEvent from '../../utils/preventEvent'

export default class SignInForm {
  static propTypes = {
    gettext: PropTypes.func.isRequired,
    form: PropTypes.shape({
      email: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired
    }).isRequired,
    validationMessagesVisible: PropTypes.bool,
    validation: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    error: PropTypes.instanceOf(Error),
    onEmailChange: PropTypes.func.isRequired,
    onPasswordChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  }

  render() {
    const {
      gettext,
      form,
      validationMessagesVisible,
      validation,
      disabled,
      error,
      onEmailChange,
      onPasswordChange,
      onSubmit
    } = this.props

    return (
      <form onSubmit={preventEvent(onSubmit)}>
        <div>
          <label htmlFor="SignInForm-Email">{gettext('Email')}</label>
          <input
            type="email"
            id="SignInForm-Email"
            placeholder={gettext('Email')}
            value={form.email}
            onChange={event => onEmailChange(event.nativeEvent.target.value)}
            disabled={disabled}
          />
          <span>
            {validationMessagesVisible
              && validation.children.email.message}
          </span>
        </div>
        <div>
          <label htmlFor="SignInForm-Password">{gettext('Password')}</label>
          <input
            type="password"
            id="SignInForm-Password"
            placeholder={gettext('Password')}
            value={form.password}
            onChange={event => onPasswordChange(event.nativeEvent.target.value)}
            disabled={disabled}
          />
          <span>
            {validationMessagesVisible
              && validation.children.password.message}
          </span>
        </div>
        <button disabled={disabled}>{gettext('Submit')}</button>
        {error && <p>{error.message}</p>}
      </form>
    )
  }
}
