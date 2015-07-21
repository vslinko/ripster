import {GraphQLString} from 'graphql'
import createUser from '../../queries/user/createUser'
import {wrapField, OP_CREATE} from '../../acl'

export default refs => wrapField(OP_CREATE, {
  type: refs.user,
  args: {
    email: {type: GraphQLString},
    password: {type: GraphQLString}
  },
  resolve: (root, args) => createUser(args.email, args.password)
})
