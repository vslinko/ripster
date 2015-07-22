import {
  root,
  main,
  join,
  fs
} from '../utils'
import {executeQuery, cypher} from '../../src/graphql/db'

main(async () => {
  const fixturesFile = join(root, 'db', 'fixtures.cypher')

  const fixtures = (await fs.readFileAsync(fixturesFile))
    .toString()
    .split(/;\n/)

  await executeQuery(cypher`
    MATCH (n)
    OPTIONAL MATCH ()-[e]-()
    DELETE n, e
  `)

  for (const query of fixtures) {
    await executeQuery({
      query
    })
  }
})
