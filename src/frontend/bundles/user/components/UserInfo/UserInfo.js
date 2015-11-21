import React, {PropTypes} from 'react';

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
