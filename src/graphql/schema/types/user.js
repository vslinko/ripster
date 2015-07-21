import {GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList} from 'graphql'
import getUserSessions from '../../queries/user/getUserSessions'
import {prop} from '../../utils'
import {wrapField, OP_READ} from '../../acl'

export default refs => new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    uuid: {
      type: GraphQLID,
      resolve: prop('uuid')
    },
    email: {
      type: GraphQLString,
      resolve: prop('email')
    },
    sessions: wrapField(OP_READ, {
      type: new GraphQLList(refs.session),
      resolve: (user) => getUserSessions(user)
    })
  })
})
