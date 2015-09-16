import React, {PropTypes} from 'react';
import testable from 'frontend/utils/testable';

@testable()
export default class UserInfo extends React.Component {
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
