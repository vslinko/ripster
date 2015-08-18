/* eslint-disable no-use-before-define */

import {GraphQLSchema} from 'graphql'
import {nodeDefinitions, connectionDefinitions, fromGlobalId} from 'graphql-relay'

import getObjectById from '../queries/common/getObjectById'

import rootQuery from './rootQuery'
import rootMutation from './rootMutation'
import * as types from './types'

const refCreators = {
  rootQuery,
  rootMutation,
  ...types
}

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    const {id} = fromGlobalId(globalId)

    return getObjectById(Number(id))
  },
  (object) => {
    const label = object.labels[0]
    const refKey = label[0].toLowerCase() + label.slice(1)

    return refs[refKey]
  }
)

const refs = Object.keys(refCreators)
  .reduce((refs, key) => (
    refs[key] = refCreators[key](refs),
    refs[key + 'Connection'] = connectionDefinitions({
      name: refs[key].name,
      nodeType: refs[key]
    }).connectionType,
    refs
  ), {nodeInterface, nodeField})

export default new GraphQLSchema({
  query: refs.rootQuery,
  mutation: refs.rootMutation
})
