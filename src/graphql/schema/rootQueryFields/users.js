import {GraphQLList} from 'graphql'
import getAllUsers from '../../queries/user/getAllUsers'
import {wrapField, OP_READ} from '../../acl'

export default refs => wrapField(OP_READ, {
  type: new GraphQLList(refs.user),
  resolve: () => getAllUsers()
})
