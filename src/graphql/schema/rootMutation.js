import {GraphQLObjectType} from 'graphql';
import {attachFields} from '../utils';

import * as fields from './rootMutationFields';

export default refs => new GraphQLObjectType({
  name: 'RootMutation',
  fields: () => attachFields(refs, fields),
});
