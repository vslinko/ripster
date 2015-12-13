import acl, { OP_READ } from '.';

export default function wrapField(field) {
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

  const { type, resolve, ...other } = typeof field === 'function'
    ? field(assertAccess)
    : field;

  const wrappedResolve = async (root, args, info) => {
    currentInfo = info;

    await assertAccess(type, OP_READ);

    const result = await resolve(root, args, info);

    if (Array.isArray(result)) {
      const checks = await* result
        .map(async (object) => ({
          object,
          access: await checkAccess(object, OP_READ),
        }));

      return checks
        .filter(({ access }) => access)
        .map(({ object }) => object);
    } else if (result && result.edges && Array.isArray(result.edges)) {
      const checks = await* result.edges
        .map(async (edge) => ({
          edge,
          access: await checkAccess(edge.node, OP_READ),
        }));

      return {
        ...result,
        edges: checks
          .map(({ edge, access }) => ({
            ...edge,
            node: access ? edge.node : null,
          })),
      };
    } else if (result && !(await checkAccess(result, OP_READ))) {
      return null;
    }

    return result;
  };

  return { type, resolve: wrappedResolve, ...other };
}
