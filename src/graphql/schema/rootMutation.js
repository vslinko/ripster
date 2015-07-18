import {GraphQLObjectType} from 'graphql'
import {attachFields} from '../utils'
import setEmail from './rootMutationFields/setEmail'
import deleteUser from './rootMutationFields/deleteUser'
import createUser from './rootMutationFields/createUser'

export default refs => new GraphQLObjectType({
  name: 'RootMutation',
  fields: () => attachFields(refs, {
    setEmail,
    deleteUser,
    createUser
  })
})
