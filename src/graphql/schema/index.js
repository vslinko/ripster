import { GraphQLSchema } from 'graphql';
import { nodeDefinitions, connectionDefinitions, fromGlobalId } from 'graphql-relay';

import rootQuery from './rootQuery';
import rootMutation from './rootMutation';
import * as types from './types';

const refCreators = {
  rootQuery,
  rootMutation,
  ...types,
};

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId, { rootValue }) => {
    const { type, id } = fromGlobalId(globalId);

    return rootValue.loaders[type].load(id);
  },
  (object) => {
    const label = object.labels[0];
    const refKey = label[0].toLowerCase() + label.slice(1);

    return refs[refKey]; // eslint-disable-line no-use-before-define
  }
);

const refs = Object.keys(refCreators)
  .reduce((acc, key) => {
    acc[key] = refCreators[key](acc);
    const {connectionType, edgeType} = connectionDefinitions({
      name: acc[key].name,
      nodeType: acc[key],
    });

    acc[key + 'Connection'] = connectionType;
    acc[key + 'Edge'] = edgeType;

    return acc;
  }, { nodeInterface, nodeField });

export default new GraphQLSchema({
  query: refs.rootQuery,
  mutation: refs.rootMutation,
});
