import {readFileAsync} from 'fs-extra-promise';
import {join} from 'path';
import {rootDir} from './utils';
import {executeQuery, cypher} from '../src/graphql/db';

const fixturesFile = join(rootDir, 'db', 'fixtures.cypher');
let fixtures;

export default async function loadFixtures() {
  if (!fixtures) {
    fixtures = (await readFileAsync(fixturesFile))
      .toString()
      .split(/;\n/);
  }

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
}
