import {executeQuery, cypher} from '../../db';

export default async function setEmail(user, email) {
  const result = await executeQuery(cypher`
    MATCH (u:User {uuid: ${user.properties.uuid}})
    SET u.email = ${email}
    RETURN u
  `);

  return result.map(row => row.u).shift();
}
