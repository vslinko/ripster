import {GraphQLObjectType, GraphQLString, GraphQLID} from 'graphql'
import {id, prop} from '../utils'

export default refs => new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: id
    },
    email: {
      type: GraphQLString,
      resolve: prop('email')
    }
  })
})
