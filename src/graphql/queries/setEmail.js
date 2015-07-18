import {executeQuery, cypher} from '../db'

export default async function setEmail(userId, email) {
  const result = await executeQuery(cypher`
    MATCH (u:User)
    WHERE id(u) = ${Number(userId)}
    SET u.email = ${email}
    RETURN u
  `)

  return result.map(row => row.u).shift()
}
