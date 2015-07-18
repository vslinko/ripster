import {GraphQLID} from 'graphql'
import getUser from '../../queries/getUser'

export default refs => ({
  type: refs.user,
  args: {
    id: {type: GraphQLID}
  },
  resolve: (root, args) => getUser(args.id)
})
