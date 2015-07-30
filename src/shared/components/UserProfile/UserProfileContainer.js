import React from 'react'

import UserProfile from './UserProfile'

export default class UserProfileContainer {
  static queries = {
    user: `
      User {
        email
      }
    `
  }

  render() {
    return (
      <UserProfile {...this.props.user} />
    )
  }
}
