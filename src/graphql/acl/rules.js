import {GraphQLObjectType, GraphQLInterfaceType, GraphQLList} from 'graphql';
import {OP_CREATE, everyRule, deny} from 'access-rule';
import isOwner from '../queries/common/isOwner';

export function byType(spec) {
  return (object, subject, operation) => {
    let resultObject = object;
    let types;

    if (resultObject instanceof GraphQLList) {
      resultObject = resultObject.ofType;
    }

    if (resultObject instanceof GraphQLObjectType || resultObject instanceof GraphQLInterfaceType) {
      if (/Connection$/.test(resultObject.name)) {
        resultObject = resultObject._fields.edges.type.ofType._fields.node.type;
      }

      types = [resultObject.name];
    }

    if (resultObject && resultObject.labels) {
      types = resultObject.labels;
    }

    if (!types) {
      return false;
    }

    const rules = types
      .map(type => spec[type] || deny);

    return everyRule(...rules)(resultObject, subject, operation);
  };
}

export function complex(baseRule, operations) {
  return (object, subject, operation) => {
    let resultObject = object;

    if (resultObject instanceof GraphQLList) {
      resultObject = resultObject.ofType;
    }

    if (resultObject instanceof GraphQLObjectType || resultObject instanceof GraphQLInterfaceType) {
      if (/Connection$/.test(resultObject.name)) {
        resultObject = resultObject._fields.edges.type.ofType._fields.node.type;
      }

      if (operation === OP_CREATE) {
        return operations[operation](resultObject, subject, operation);
      }

      return baseRule(resultObject, subject, operation);
    }

    return operations[operation](resultObject, subject, operation);
  };
}

export function admin(object, subject) {
  return Promise.resolve(
    subject && subject.properties.role === 'ADMIN'
  );
}

export function self(object, subject) {
  if (!object || !subject) {
    return Promise.resolve(false);
  }

  if (typeof object._id !== 'number' || typeof subject._id !== 'number') {
    return Promise.resolve(false);
  }

  return Promise.resolve(object._id === subject._id);
}

export function owner(object, subject) {
  if (!subject) {
    return false;
  }

  return isOwner(object, subject);
}
