import {GraphQLObjectType, GraphQLID} from 'graphql'
import getSessionOwner from '../../queries/session/getSessionOwner'
import {prop} from '../../utils'
import {wrapField, OP_READ} from '../../acl'

export default refs => new GraphQLObjectType({
  name: 'Session',
  fields: () => ({
    sid: {
      type: GraphQLID,
      resolve: prop('sid')
    },
    user: wrapField(OP_READ, {
      type: refs.user,
      resolve: (session) => getSessionOwner(session)
    })
  })
})
