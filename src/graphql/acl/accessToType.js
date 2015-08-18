import {
  allow,
  deny,
  byOperation,
  OP_CREATE,
  OP_READ,
  OP_UPDATE,
  OP_DELETE
} from 'access-rule'

export const Node = byOperation({
  [OP_CREATE]: allow,
  [OP_READ]: allow,
  [OP_UPDATE]: allow,
  [OP_DELETE]: allow
})

export const User = byOperation({
  [OP_CREATE]: allow,
  [OP_READ]: allow,
  [OP_UPDATE]: allow,
  [OP_DELETE]: deny
})

export const Session = byOperation({
  [OP_CREATE]: allow,
  [OP_READ]: allow,
  [OP_UPDATE]: deny,
  [OP_DELETE]: allow
})
