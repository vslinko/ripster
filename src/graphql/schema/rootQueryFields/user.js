import {GraphQLID} from 'graphql'
import getUserByUUID from '../../queries/user/getUserByUUID'
import {wrapField, OP_READ} from '../../acl'

export default refs => wrapField(OP_READ, {
  type: refs.user,
  args: {
    uuid: {type: GraphQLID}
  },
  resolve: (root, args) => getUserByUUID(args.uuid)
})
