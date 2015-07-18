import {GraphQLList} from 'graphql'
import getUsers from '../../queries/getUsers'

export default refs => ({
  type: new GraphQLList(refs.user),
  resolve: () => getUsers()
})
