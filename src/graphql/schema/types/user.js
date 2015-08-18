import {GraphQLObjectType, GraphQLString} from 'graphql'
import getUserSessions from '../../queries/user/getUserSessions'
import {idField, prop} from '../../utils'
import {wrapConnectionField, OP_READ} from '../../acl'

export default refs => new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: idField('User'),
    uuid: {
      type: GraphQLString,
      resolve: prop('uuid')
    },
    email: {
      type: GraphQLString,
      resolve: prop('email')
    },
    sessions: wrapConnectionField(OP_READ, {
      type: refs.sessionConnection,
      resolve: (user) => getUserSessions(user)
    })
  }),
  interfaces: [refs.nodeInterface]
})
