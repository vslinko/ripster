import DataLoader from 'dataloader';
import { executeQuery } from './db';

function createNodeLoader({ queriesLoader, nodeLabel, idFieldName = 'uuid' }) {
  return new DataLoader(async (ids) => {
    const response = await queriesLoader.load({
      query: `
        MATCH (n:${nodeLabel})
        WHERE n.${idFieldName} IN {ids}
        RETURN n
      `,
      params: { ids },
    });

    const nodes = response.map(row => row.n);

    return ids.map((id) => {
      return nodes.filter((node) => {
        return node.properties[idFieldName] === id;
      }).shift();
    });
  });
}

export default function createLoaders() {
  const queriesLoader = new DataLoader((queries) => {
    return executeQuery({ queries });
  });

  return {
    queries: queriesLoader,
    User: createNodeLoader({
      queriesLoader,
      nodeLabel: 'User',
    }),
    Session: createNodeLoader({
      queriesLoader,
      nodeLabel: 'Session',
      idFieldName: 'sid',
    }),
  };
}
