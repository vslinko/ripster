import { executeQuery, cypher } from '../../db';

export default async function getSessionOwner(session) {
  const result = await executeQuery(cypher`
    MATCH (s:Session { sid: ${session.properties.sid} })
    MATCH (u:User)-[:OWNS]->(s)
    RETURN u
  `);

  return result.map(row => row.u).shift();
}
