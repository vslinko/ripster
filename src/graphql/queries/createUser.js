import {executeQuery, cypher} from '../db'

export default async function createUser(email) {
  const result = await executeQuery(cypher`
    CREATE (u:User {email: ${email}})
    RETURN u
  `)

  return result.map(row => row.u).shift()
}
