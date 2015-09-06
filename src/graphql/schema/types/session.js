import {GraphQLObjectType, GraphQLString} from 'graphql';
import getSessionOwner from '../../queries/session/getSessionOwner';
import {idField, prop} from '../../utils';
import {wrapField} from '../../acl';

export default refs => new GraphQLObjectType({
  name: 'Session',
  fields: () => ({
    id: idField('Session'),
    sid: {
      type: GraphQLString,
      resolve: prop('sid'),
    },
    user: wrapField({
      type: refs.user,
      resolve: (session) => getSessionOwner(session),
    }),
  }),
  interfaces: [refs.nodeInterface],
});
