import {connectionArgs, connectionFromPromisedArray} from 'graphql-relay';
import wrapField from './wrapField';

export default function wrapConnectionField(field) {
  const {resolve, ...other} = wrapField(field);

  return {
    ...other,
    args: connectionArgs,
    resolve: (root, args, ...restArgs) => connectionFromPromisedArray(
      Promise.resolve(resolve(root, args, ...restArgs)),
      args
    ),
  };
}
