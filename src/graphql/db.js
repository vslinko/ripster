import neo4j from 'neo4j';
import config from './config';

const url = process.env.NEO4J_URL
  || process.env.GRAPHENEDB_URL
  || config.get('neo4j:url');

export const db = new neo4j.GraphDatabase(url);

export function executeQuery(query) {
  return new Promise((resolve, reject) => {
    db.cypher(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export function cypher(strings, ...values) {
  return strings
    .reduce(({query, params}, string, index) => {
      if (index === 0) {
        return {query: string, params: {}};
      }

      const paramIndex = index - 1;

      return {
        query: `${query}{param${paramIndex}}${string}`,
        params: {...params, [`param${paramIndex}`]: values[paramIndex]},
      };
    }, {});
}
