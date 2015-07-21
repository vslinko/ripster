import {randomBytes} from 'crypto'
import {executeQuery, cypher} from '../../db'

function generateSessionId() {
  return new Promise((resolve, reject) => {
    randomBytes(256, (err, buf) => {
      if (err) {
        reject(err)
      } else {
        resolve(buf.toString('base64'))
      }
    })
  })
}

export default async function createSessionForUser(user) {
  const sessionId = await generateSessionId()

  const result = await executeQuery(cypher`
    MATCH (u:User {uuid: ${user.properties.uuid}})
    CREATE (s:Session {sid: ${sessionId}})
    CREATE (u)-[:OWNS]->(s)
    RETURN s
  `)

  return result.map(row => row.s).shift()
}
