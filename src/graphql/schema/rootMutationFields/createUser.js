import {GraphQLString} from 'graphql'
import createUser from '../../queries/createUser'

export default refs => ({
  type: refs.user,
  args: {
    email: {type: GraphQLString}
  },
  resolve: (root, args) => createUser(args.email)
})
