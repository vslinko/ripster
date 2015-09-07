import React, {PropTypes} from 'react';
import testDecorator from '../../utils/testDecorator';

@testDecorator()
export default class UserInfo {
  static propTypes = {
    fields: PropTypes.shape({
      email: PropTypes.object.isRequired,
    }).isRequired,
    handleSubmit: PropTypes.func.isRequired,
  }

  render() {
    const {
      fields: {email},
      handleSubmit,
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <input
          {...email}
        />
        <button>Submit</button>
      </form>
    );
  }
}
