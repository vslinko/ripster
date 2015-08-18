import {GraphQLObjectType, GraphQLInterfaceType, GraphQLList} from 'graphql'
import {OP_CREATE, everyRule, deny} from 'access-rule'
import isOwner from '../queries/common/isOwner'

export function byType(spec) {
  return (object, subject, operation) => {
    let types

    if (object instanceof GraphQLList) {
      object = object.ofType
    }

    if (object instanceof GraphQLObjectType || object instanceof GraphQLInterfaceType) {
      if (/Connection$/.test(object.name)) {
        /* eslint-disable no-underscore-dangle */
        object = object._fields.edges.type.ofType._fields.node.type
        /* eslint-enable no-underscore-dangle */
      }

      types = [object.name]
    }

    if (object && object.labels) {
      types = object.labels
    }

    if (!types) {
      return false
    }

    const rules = types
      .map(type => spec[type] || deny)

    return everyRule(...rules)(object, subject, operation)
  }
}

export function complex(baseRule, operations) {
  return (object, subject, operation) => {
    if (object instanceof GraphQLList) {
      object = object.ofType
    }

    if (object instanceof GraphQLObjectType || object instanceof GraphQLInterfaceType) {
      if (/Connection$/.test(object.name)) {
        /* eslint-disable no-underscore-dangle */
        object = object._fields.edges.type.ofType._fields.node.type
        /* eslint-enable no-underscore-dangle */
      }

      if (operation === OP_CREATE) {
        return operations[operation](object, subject, operation)
      }

      return baseRule(object, subject, operation)
    }

    return operations[operation](object, subject, operation)
  }
}

export function admin(object, subject) {
  return Promise.resolve(
    subject && subject.properties.role === 'ADMIN'
  )
}

/* eslint-disable no-underscore-dangle */
export function self(object, subject) {
  if (!object || !subject) {
    return Promise.resolve(false)
  }

  if (typeof object._id !== 'number' || typeof subject._id !== 'number') {
    return Promise.resolve(false)
  }

  return Promise.resolve(object._id === subject._id)
}
/* eslint-enable no-underscore-dangle */

export function owner(object, subject) {
  if (!subject) {
    return false
  }

  return isOwner(object, subject)
}
