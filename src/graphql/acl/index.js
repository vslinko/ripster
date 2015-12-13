import {
  allow,
  deny,
  someRule,
  OP_CREATE,
  OP_READ,
  OP_UPDATE,
  OP_DELETE,
} from 'access-rule';

import {
  byType,
  complex,
  admin,
  self,
  owner,
} from './rules';

export {
  OP_CREATE,
  OP_READ,
  OP_UPDATE,
  OP_DELETE,
} from 'access-rule';

export { default as wrapField } from './wrapField';
export { default as wrapConnectionField } from './wrapConnectionField';

export default byType({
  CreateSessionPayload: allow,
  CreateUserPayload: allow,
  SetEmailPayload: allow,

  Node: allow,

  User: complex(allow, {                // UserACL(User, OP_READ | OP_UPDATE | OP_DELETE)
    [OP_CREATE]: allow,                 // UserACL(User, OP_CREATE) | UserACL(user, OP_CREATE)
    [OP_READ]: allow,                   // UserACL(user, OP_READ)
    [OP_UPDATE]: someRule(admin, self), // UserACL(user, OP_UPDATE)
    [OP_DELETE]: deny,                  // UserACL(user, OP_DELETE)
  }),

  Session: complex(allow, {
    [OP_CREATE]: allow,
    [OP_READ]: owner,
    [OP_UPDATE]: deny,
    [OP_DELETE]: owner,
  }),
});
