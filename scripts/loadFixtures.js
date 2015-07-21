#!/usr/bin/env babel-node

/* eslint-disable no-console */

import path from 'path'
import fs from 'fs'
import {executeQuery, cypher} from '../src/graphql/db'

const fixturesFile = path.join(__dirname, '..', 'db', 'fixtures.cypher')

async function main() {
  try {
    const fixtures = fs.readFileSync(fixturesFile).toString().split(/;\n/)

    await executeQuery(cypher`
      MATCH (n)
      OPTIONAL MATCH ()-[e]-()
      DELETE n, e
    `)

    for (const fixture of fixtures) {
      await executeQuery({
        query: fixture
      })
    }

  } catch (err) {
    console.log(err.stack)
  }
}

main()
