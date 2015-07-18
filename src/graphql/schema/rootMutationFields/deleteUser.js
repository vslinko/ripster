import {GraphQLID, GraphQLBoolean} from 'graphql'
import deleteUser from '../../queries/deleteUser'

export default refs => ({
  type: GraphQLBoolean,
  args: {
    id: {type: GraphQLID}
  },
  resolve: (root, args) => deleteUser(args.id)
})
