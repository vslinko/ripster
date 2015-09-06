import {executeQuery, cypher} from '../../db';

export default async function getUserByEmail(email) {
  const result = await executeQuery(cypher`
    MATCH (u:User {email: ${email}})
    RETURN u
  `);

  return result.map(row => row.u).shift();
}
