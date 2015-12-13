import { writeFileSync } from 'fs';
import { join } from 'path';
import Schema from '../../src/graphql/schema';
import { graphql } from 'graphql';
import { introspectionQuery } from 'graphql/utilities';

async () => {
  const result = await graphql(Schema, introspectionQuery);

  if (result.errors) {
    console.error('ERROR:', JSON.stringify(result.errors, null, 2)); // eslint-disable-line no-console
    return;
  }

  writeFileSync(
    join(__dirname, '..', '..', 'src', 'graphql', 'schema', 'schema.json'),
    JSON.stringify(result, null, 2)
  );
}();
