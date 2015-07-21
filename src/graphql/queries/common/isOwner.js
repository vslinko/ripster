/* eslint-disable no-underscore-dangle */

import {executeQuery, cypher} from '../../db'

export default async function isOwner(object, subject) {
  const result = await executeQuery(cypher`
    MATCH (object), (subject)
    WHERE id(object) = ${object._id} AND id(subject) = ${subject._id}
    RETURN EXISTS((subject)-[:OWNS]->(object)) as owns
  `)

  return result.map(row => row.owns).shift()
}
