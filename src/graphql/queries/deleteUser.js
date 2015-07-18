import {executeQuery, cypher} from '../db'

export default async function deleteUser(userId) {
  await executeQuery(cypher`
    MATCH (u:User)
    WHERE id(u) = ${Number(userId)}
    OPTIONAL MATCH (u)-[r]-()
    DELETE u, r
  `)

  return true
}
