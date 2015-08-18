import bcrypt from 'bcryptjs'
import {GraphQLString} from 'graphql'
import getUserByEmail from '../../queries/user/getUserByEmail'
import createSessionForUser from '../../queries/session/createSessionForUser'
import {wrapField, OP_CREATE} from '../../acl'

function comparePasswords(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, equals) => {
      if (err) {
        reject(err)
      } else {
        resolve(equals)
      }
    })
  })
}

function timeout() {
  return new Promise(resolve => setTimeout(resolve, 500))
}

export default refs => wrapField(OP_CREATE, {
  type: refs.session,
  args: {
    email: {type: GraphQLString},
    password: {type: GraphQLString}
  },
  resolve: async (root, {email, password}, info) => {
    const user = await getUserByEmail(email)

    if (!user) {
      await timeout()
      throw new Error('Invalid credentials')
    }

    const passwordsEquals = await comparePasswords(
      password,
      user.properties.password
    )

    if (!passwordsEquals) {
      await timeout()
      throw new Error('Invalid credentials')
    }

    info.rootValue.user = user

    return await createSessionForUser(user)
  }
})
