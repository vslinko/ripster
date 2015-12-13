import { GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';
import setEmail from '../../queries/user/setEmail';
import { wrapMutation, wrapField, OP_UPDATE } from '../../acl';

export default refs => wrapMutation(assertAccess => mutationWithClientMutationId({
  name: 'SetEmail',
  inputFields: {
    id: { type: GraphQLID },
    email: { type: GraphQLString },
  },
  outputFields: {
    user: wrapField({
      type: refs.user,
      resolve: user => user,
    }),
  },
  mutateAndGetPayload: async ({ id, email }, { rootValue }) => {
    const user = await rootValue.loaders.User.load(fromGlobalId(id).id);

    if (!user) {
      return null;
    }

    await assertAccess(user, OP_UPDATE);

    return await setEmail(user, email);
  },
}));
