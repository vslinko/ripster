import {executeQuery, cypher} from '../db'

export default async function getUser(id) {
  const result = await executeQuery(cypher`
    MATCH (u:User)
    WHERE id(u) = ${Number(id)}
    RETURN u
  `)

  return result.map(row => row.u).shift()
}
