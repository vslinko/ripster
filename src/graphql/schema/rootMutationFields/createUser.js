import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import createUser from '../../queries/user/createUser';
import { wrapMutation, wrapField, OP_CREATE } from '../../acl';

export default refs => wrapMutation(assertAccess => mutationWithClientMutationId({
  name: 'CreateUser',
  inputFields: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  outputFields: {
    user: wrapField({
      type: refs.user,
      resolve: user => user,
    }),
  },
  mutateAndGetPayload: async ({ email, password }) => {
    await assertAccess(refs.user, OP_CREATE);

    return await createUser(email, password);
  },
}));
