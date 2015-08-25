import React from 'react'
import testDecorator from '../../utils/testDecorator'

@testDecorator()
export default class UserInfo {
  render() {
    const {
      form: {email},
      onEmailChange,
      onSubmit,
      error
    } = this.props

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
    )
  }
}
