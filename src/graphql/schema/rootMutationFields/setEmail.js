import {GraphQLID, GraphQLString} from 'graphql'
import setEmail from '../../queries/setEmail'

export default refs => ({
  type: refs.user,
  args: {
    userId: {type: GraphQLID},
    email: {type: GraphQLString}
  },
  resolve: (root, args) => setEmail(args.userId, args.email)
})
