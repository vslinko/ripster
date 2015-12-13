import { GraphQLObjectType } from 'graphql';
import { attachFields } from '../utils';
import { wrapField } from '../acl';

import * as fields from './rootQueryFields';

export default refs => new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    node: wrapField(refs.nodeField),
    viewer: {
      type: new GraphQLObjectType({
        name: 'Viewer',
        fields: () => attachFields(refs, fields),
      }),
      resolve: (root) => root,
    },
  }),
});
