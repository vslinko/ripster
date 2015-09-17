import {globalIdField} from 'graphql-relay';

export function idField(type, idFieldName = 'uuid') {
  return globalIdField(type, object => object.properties[idFieldName]);
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
