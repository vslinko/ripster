import {GraphQLObjectType} from 'graphql'
import {attachFields} from '../utils'
import user from './rootQueryFields/user'
import users from './rootQueryFields/users'

export default refs => new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => attachFields(refs, {
    user,
    users
  })
})
