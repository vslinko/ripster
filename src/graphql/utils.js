import {globalIdField} from 'graphql-relay';

export function idField(type) {
  return globalIdField(type, object => object._id);
}

export function prop(key) {
  return object => object.properties[key];
}

export function attachFields(refs, fields) {
  return Object.keys(fields)
    .reduce((acc, key) => (
      acc[key] = fields[key](refs),
      acc
    ), {});
}
