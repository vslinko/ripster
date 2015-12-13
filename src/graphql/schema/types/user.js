import { GraphQLObjectType, GraphQLString } from 'graphql';
import getUserSessions from '../../queries/user/getUserSessions';
import { idField, prop } from '../../utils';
import { wrapConnectionField } from '../../acl';

export default refs => new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: idField('User'),
    email: {
      type: GraphQLString,
      resolve: prop('email'),
    },
    sessions: wrapConnectionField({
      type: refs.sessionConnection,
      resolve: (user) => getUserSessions(user),
    }),
  }),
  interfaces: [refs.nodeInterface],
});
