import {
  byGraphQLType,
  byDatabaseObjectLabel,
  byObject
} from './rules'

import * as accessToTypeSchema from './accessToType'
import * as accessToObjectSchema from './accessToObject'

export {
  OP_CREATE,
  OP_READ,
  OP_UPDATE,
  OP_DELETE
} from 'access-rule'

export {default as wrapField} from './wrapField'
export {default as wrapConnectionField} from './wrapConnectionField'

export default byObject(
  byGraphQLType(accessToTypeSchema),
  byDatabaseObjectLabel(accessToObjectSchema)
)
