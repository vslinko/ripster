import {connectionArgs, connectionFromPromisedArray} from 'graphql-relay';
import wrapField from './wrapField';

export default function wrapConnectionField(field) {
  const {resolve, ...other} = wrapField(field);

  return {
    ...other,
    args: {
      ...(other.args || {}),
      ...connectionArgs,
    },
    resolve: (root, args, info) => connectionFromPromisedArray(
      Promise.resolve(resolve(root, args, info)),
      args
    ),
  };
}
