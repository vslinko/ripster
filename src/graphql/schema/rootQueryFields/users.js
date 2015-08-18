import {GraphQLList} from 'graphql'
import getAllUsers from '../../queries/user/getAllUsers'
import {wrapField} from '../../acl'

export default refs => wrapField({
  type: new GraphQLList(refs.user),
  resolve: () => getAllUsers()
})
