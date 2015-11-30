import neo4j from 'neo4j';
import config from './config';

const url = process.env.NEO4J_URL
  || process.env.GRAPHENEDB_URL
  || config.get('neo4j:url');

export const db = new neo4j.GraphDatabase(url);

export async function transaction(cb) {
  const tx = db.beginTransaction();

  function executeTransactionQuery(query) {
    return new Promise((resolve, reject) => {
      tx.cypher(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  try {
    await cb(executeTransactionQuery);

    await new Promise((resolve, reject) => {
      tx.commit((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (err) {
    if (tx.state === tx.STATE_OPEN || tx.state === tx.STATE_PENDING) {
      await new Promise((resolve, reject) => {
        tx.rollback(() => {
          reject(err);
        });
      });
    } else {
      throw err;
    }
  }
}

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
