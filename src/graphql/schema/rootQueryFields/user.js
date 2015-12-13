import { GraphQLID, GraphQLNonNull } from 'graphql';
import { fromGlobalId } from 'graphql-relay';
import { wrapField } from '../../acl';

export default refs => wrapField({
  type: refs.user,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: (rootValue, args) => rootValue.loaders.User.load(fromGlobalId(args.id).id),
});
