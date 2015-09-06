import React, {PropTypes} from 'react';
import testDecorator from '../../utils/testDecorator';

@testDecorator()
export default class UserInfo {
  static propTypes = {
    form: PropTypes.shape({
      email: PropTypes.string.isRequired,
    }).isRequired,
    onEmailChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.string.isRequired,
    children: PropTypes.node,
  }

  render() {
    const {
      form: {email},
      onEmailChange,
      onSubmit,
      error,
    } = this.props;

    return (
      <form onSubmit={event => (event.preventDefault(), onSubmit())}>
        <input
          value={email}
          onChange={event => onEmailChange(event.target.value)}
        />
        {this.props.children}
        <button>Submit</button>
        {error}
      </form>
    );
  }
}
