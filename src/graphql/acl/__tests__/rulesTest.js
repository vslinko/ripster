import test from 'blue-tape';
import { admin } from '../rules';

test('graphql/acl/rules/admin', async (t) => {
  t.ok(await admin(null, { properties: { role: 'ADMIN' } }));
  t.notok(await admin(null, { properties: { role: 'USER' } }));
  t.notok(await admin(null, {}));
  t.notok(await admin(null, null));
});
