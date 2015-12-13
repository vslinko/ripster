import { executeQuery, cypher } from '../../db';

export default async function getAllUsers() {
  const result = await executeQuery(cypher`
    MATCH (u:User)
    RETURN u
  `);

  return result.map(row => row.u);
}
