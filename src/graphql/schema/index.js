import {GraphQLSchema} from 'graphql';
import {nodeDefinitions, connectionDefinitions, fromGlobalId} from 'graphql-relay';

import rootQuery from './rootQuery';
import rootMutation from './rootMutation';
import * as types from './types';

const refCreators = {
  rootQuery,
  rootMutation,
  ...types,
};

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId, {rootValue}) => {
    const {type, id} = fromGlobalId(globalId);

    return rootValue.loaders[type].load(id);
  },
  (object) => {
    const label = object.labels[0];
    const refKey = label[0].toLowerCase() + label.slice(1);

    return refs[refKey]; // eslint-disable-line no-use-before-define
  }
);

const refs = Object.keys(refCreators)
  .reduce((acc, key) => (
    acc[key] = refCreators[key](acc),
    acc[key + 'Connection'] = connectionDefinitions({
      name: acc[key].name,
      nodeType: acc[key],
    }).connectionType,
    acc
  ), {nodeInterface, nodeField});

export default new GraphQLSchema({
  query: refs.rootQuery,
  mutation: refs.rootMutation,
});
