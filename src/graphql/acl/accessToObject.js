import {
  allow,
  deny,
  someRule,
  byOperation,
  OP_READ,
  OP_UPDATE,
  OP_DELETE
} from 'access-rule'

import {
  admin,
  self,
  owner
} from './rules'

// OP_CREATE operation is not allowed here because objects are already created

export const User = byOperation({
  [OP_READ]: allow,
  [OP_UPDATE]: someRule(admin, self),
  [OP_DELETE]: deny
})

export const Session = byOperation({
  [OP_READ]: owner,
  [OP_UPDATE]: deny,
  [OP_DELETE]: owner
})
