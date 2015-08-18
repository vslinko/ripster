/* eslint-disable max-params */

import acl, {OP_READ} from '.'

export default function wrapField(field) {
  let currentInfo

  const checkAccess = (object, operation) => {
    return acl(object, currentInfo.rootValue.user, operation)
  }

  const assertAccess = async (object, operation) => {
    if (await checkAccess(object, operation)) {
      return
    }

    const userText = currentInfo.rootValue.user
      ? `User "${currentInfo.rootValue.user.properties.email}"`
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

  const {type, resolve, ...other} = typeof field === 'function'
    ? field(assertAccess)
    : field

  const wrappedResolve = async (root, args, info) => {
    currentInfo = info

    await assertAccess(type, OP_READ)

    const result = await resolve(root, args, info)

    if (Array.isArray(result)) {
      const checks = await* result
        .map(async (object) => ({
          object,
          access: await checkAccess(object, OP_READ)
        }))

      return checks
        .filter(({access}) => access)
        .map(({object}) => object)

    } else if (result && !await checkAccess(result, OP_READ)) {
      return
    }

    return result
  }

  return {type, resolve: wrappedResolve, ...other}
}
