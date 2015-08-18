import {connectionArgs, connectionFromPromisedArray} from 'graphql-relay'
import wrapField from './wrapField'

export default function wrapConnectionField(operation, field) {
  const {resolve, ...other} = wrapField(operation, field)

  return {
    ...other,
    args: connectionArgs,
    resolve: (root, args, ...restArgs) => connectionFromPromisedArray(
      resolve(root, args, ...restArgs),
      args
    )
  }
}
