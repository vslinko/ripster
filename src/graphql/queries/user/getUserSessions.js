import { executeQuery, cypher } from '../../db';

export default async function getUserSessions(user) {
  const result = await executeQuery(cypher`
    MATCH (u:User { uuid: ${user.properties.uuid} })
    MATCH (s:Session)<-[:OWNS]-(u)
    RETURN s
  `);

  return result.map(row => row.s);
}
