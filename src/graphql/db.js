import neo4j from 'neo4j';
import config from './config';

const url = process.env.NEO4J_URL
  || process.env.GRAPHENEDB_URL
  || config.get('neo4j:url');

class Cypher {
  constructor(strings, values) {
    this._strings = strings;
    this._values = values;
  }

  getOptions() {
    return this._getOptions({});
  }

  _getOptions({ paramPrefix = 'p_' }) {
    return this._strings
      .reduce(({ query, params }, string, index) => {
        if (index === 0) {
          return { query: string, params: {} };
        }

        const paramIndex = index - 1;
        const value = this._values[paramIndex];

        if (value instanceof Cypher) {
          const options = value._getOptions({
            paramPrefix: paramPrefix + paramIndex + '_',
          });

          return {
            query: `${query}${options.query}${string}`,
            params: { ...params, ...options.params },
          };
        }

        return {
          query: `${query}{${paramPrefix}${paramIndex}}${string}`,
          params: { ...params, [`${paramPrefix}${paramIndex}`]: value },
        };
      }, {});
  }
}

function createQueryExecutor(context) {
  const executor = function executeQuery(query) {
    if (typeof query === 'function') {
      return query(executor);
    }

    const rawQuery = query instanceof Cypher
      ? query.getOptions()
      : query;

    return new Promise((resolve, reject) => {
      context.cypher(rawQuery, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };

  return executor;
}

export const db = new neo4j.GraphDatabase(url);

export async function transaction(cb) {
  const tx = db.beginTransaction();

  const executeTransactionQuery = createQueryExecutor(tx);

  try {
    const result = await cb(executeTransactionQuery);

    await new Promise((resolve, reject) => {
      tx.commit((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    return result;
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

export const executeQuery = createQueryExecutor(db);

export function isEmptyResult(result) {
  return !result || !result.length || result.length <= 0;
}

export function assertResult(result, message = 'Arguments are invalid') {
  if (isEmptyResult(result)) {
    throw new Error(message);
  }
}

export function filterNodes(result, key = 'node') {
  return result.map(row => row[key]).filter(node => !!node);
}

export function filterNode(result, key = 'node') {
  return filterNodes(result, key).shift();
}

export function cypher(strings, ...values) {
  return new Cypher(strings, values);
}
