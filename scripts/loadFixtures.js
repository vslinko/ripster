#!/usr/bin/env babel-node

/* eslint-disable no-console */

import path from 'path'
import fs from 'fs'
import {executeQuery, cypher} from '../src/graphql/db'

const fixturesFile = path.join(__dirname, '..', 'db', 'fixtures.cypher')

async function main() {
  try {
    const fixtures = fs.readFileSync(fixturesFile).toString()

    await executeQuery(cypher`
      MATCH (n)
      OPTIONAL MATCH ()-[e]-()
      DELETE n, e
    `)

    await executeQuery({
      query: fixtures
    })

  } catch (err) {
    console.log(err.stack)
  }
}

main()
