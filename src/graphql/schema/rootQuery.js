import {GraphQLObjectType} from 'graphql'
import {attachFields} from '../utils'

import * as fields from './rootQueryFields'

export default refs => new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => attachFields(refs, fields)
})
