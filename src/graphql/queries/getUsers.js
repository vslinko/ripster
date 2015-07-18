import {executeQuery, cypher} from '../db'

export default async function getUsers() {
  const result = await executeQuery(cypher`
    MATCH (u:User)
    RETURN u
  `)

  return result.map(row => row.u)
}
