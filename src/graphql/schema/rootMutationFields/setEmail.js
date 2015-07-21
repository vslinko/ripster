import {GraphQLID, GraphQLString} from 'graphql'
import getUserByUUID from '../../queries/user/getUserByUUID'
import setEmail from '../../queries/user/setEmail'
import {wrapField, OP_UPDATE} from '../../acl'

export default refs => wrapField(OP_UPDATE, assertAccess => ({
  type: refs.user,
  args: {
    uuid: {type: GraphQLID},
    email: {type: GraphQLString}
  },
  resolve: async (root, args) => {
    const user = await getUserByUUID(args.uuid)

    if (!user) {
      return
    }

    await assertAccess(user)

    return await setEmail(user, args.email)
  }
}))
