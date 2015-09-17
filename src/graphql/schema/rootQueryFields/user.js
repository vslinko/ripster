import {GraphQLID} from 'graphql';
import {wrapField} from '../../acl';

export default refs => wrapField({
  type: refs.user,
  args: {
    uuid: {type: GraphQLID},
  },
  resolve: (root, args) => root.loaders.User.load(args.uuid),
});
