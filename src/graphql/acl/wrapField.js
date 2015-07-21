/* eslint-disable max-params */

import acl, {OP_CREATE, OP_READ, OP_UPDATE, OP_DELETE} from '.'

const knownOperations = [OP_CREATE, OP_READ, OP_UPDATE, OP_DELETE]
const functionOperations = [OP_UPDATE, OP_DELETE]

export default function wrapField(operation, field) {
  let context

  if (knownOperations.indexOf(operation) < 0) {
    throw new Error(`Unknown operation "${operation}"`)
  }

  const fieldIsFunction = typeof field === 'function'
  const fieldMustBeFunction = functionOperations.indexOf(operation) >= 0

  if (fieldMustBeFunction && !fieldIsFunction) {
    throw new Error(
      `You must assert access to object before operation "${operation}"`
    )
  }

  const checkReadAccess = (object) => {
    return acl(object, context.user, OP_READ)
  }

  const checkAccess = (object) => {
    return acl(object, context.user, operation)
  }

  const assertAccess = async (object) => {
    if (!await checkAccess(object)) {
      const userText = context.user
        ? `User "${context.user.properties.email}"`
        : 'Anonymous user'

      const operationText = `operation "${operation}"`

      /* eslint-disable no-underscore-dangle */
      const objectText = object.name
        ? `type ${object.name}`
        : `object (:${object.labels.join(':')}) with id "${object._id}"`
      /* eslint-enable no-underscore-dangle */

      const text = `${userText} can not make ${operationText} on ${objectText}`

      throw new Error(`Forbidden: ${text}`)
    }
  }

  const {type, resolve, ...other} = fieldIsFunction
    ? field(assertAccess)
    : field

  const wrappedResolve = async (root, args, ctx, ...other) => {
    context = ctx

    await assertAccess(type)

    const result = await resolve(root, args, context, ...other)

    if (Array.isArray(result)) {
      const checks = await* result
        .map(async (object) => ({
          object,
          access: await checkReadAccess(object)
        }))

      return checks
        .filter(({access}) => access)
        .map(({object}) => object)

    } else if (result && !await checkReadAccess(result)) {
      return
    }

    return result
  }

  return {type, resolve: wrappedResolve, ...other}
}
