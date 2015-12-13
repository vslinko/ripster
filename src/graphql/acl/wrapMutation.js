import acl from '.';

export default function wrapMutation(field) {
  let currentInfo;

  const checkAccess = (object, operation) => {
    return acl(object, currentInfo.rootValue.user, operation);
  };

  const assertAccess = async (object, operation) => {
    if (await checkAccess(object, operation)) {
      return;
    }

    const userText = currentInfo.rootValue.user
      ? `User "${currentInfo.rootValue.user.properties.email}"`
      : 'Anonymous user';

    const operationText = `operation "${operation}"`;

    const objectText = object.name || object.ofType
      ? `type ${object.name || object.ofType.name}`
      : `object (:${object.labels.join(':')}) with id "${object._id}"`;

    const text = `${userText} can not make ${operationText} on ${objectText}`;

    throw new Error(`Forbidden: ${text}`);
  };

  const {type, resolve, ...other} = field(assertAccess);

  const wrappedResolve = (rootValue, args, info) => {
    currentInfo = info;

    return resolve(rootValue, args, info);
  };

  return {type, resolve: wrappedResolve, ...other};
}
