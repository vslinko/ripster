import {GraphQLSchema} from 'graphql'

import rootQuery from './rootQuery'
import rootMutation from './rootMutation'
import * as types from './types'

const refCreators = {
  rootQuery,
  rootMutation,
  ...types
}

const refs = Object.keys(refCreators)
  .reduce((refs, key) => (
    refs[key] = refCreators[key](refs),
    refs
  ), {})

export default new GraphQLSchema({
  query: refs.rootQuery,
  mutation: refs.rootMutation
})
