import {executeQuery, cypher} from '../../db';

export default async function getUserByToken(token) {
  const result = await executeQuery(cypher`
    MATCH (s:Session {sid: ${token}})
    MATCH (u)-[:OWNS]->(s)
    RETURN u
  `);

  return result.map(row => row.u).shift();
}
