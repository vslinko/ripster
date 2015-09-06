import {GraphQLObjectType} from 'graphql';
import {attachFields} from '../utils';

import * as fields from './rootQueryFields';

export default refs => new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    viewer: {
      type: new GraphQLObjectType({
        name: 'Viewer',
        fields: () => attachFields(refs, fields),
      }),
      resolve: (root) => root,
    },
  }),
});
