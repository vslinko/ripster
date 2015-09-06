import {readFileAsync} from 'fs-extra-promise';
import {join} from 'path';
import {rootDir, main} from '../utils';
import {executeQuery, cypher} from '../../src/graphql/db';

main(async () => {
  const fixturesFile = join(rootDir, 'db', 'fixtures.cypher');

  const fixtures = (await readFileAsync(fixturesFile))
    .toString()
    .split(/;\n/);

  await executeQuery(cypher`
    MATCH (n)
    OPTIONAL MATCH ()-[e]-()
    DELETE n, e
  `);

  for (const query of fixtures) {
    await executeQuery({
      query,
    });
  }
});
