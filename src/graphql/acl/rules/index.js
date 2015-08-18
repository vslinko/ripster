import {GraphQLObjectType, GraphQLInterfaceType, GraphQLList} from 'graphql'
import {everyRule, deny} from 'access-rule'
import isOwner from '../../queries/common/isOwner'

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

export function byGraphQLType(spec, defaultRule = deny) {
  return function accessToType(object, subject, operation) {
    const rule = spec[object.name] || defaultRule

    return rule(object, subject, operation)
  }
}

export function byDatabaseObjectLabel(spec, defaultRule = deny) {
  return function accessToType(object, subject, operation) {
    if (!object) {
      return false
    }

    const rules = object.labels
      .map(label => spec[label] || defaultRule)

    return everyRule(...rules)(object, subject, operation)
  }
}

export function byObject(accessToType, accessToObject) {
  return (object, subject, operation) => {
    if (/Connection$/.test(object.name)) {
      /* eslint-disable no-underscore-dangle */
      object = object._fields.edges.type.ofType._fields.node.type
      /* eslint-enable no-underscore-dangle */
    }

    if (object instanceof GraphQLList) {
      return accessToType(object.ofType, subject, operation)

    } else if (object instanceof GraphQLObjectType || object instanceof GraphQLInterfaceType) {
      return accessToType(object, subject, operation)

    } else {
      return accessToObject(object, subject, operation)
    }
  }
}
