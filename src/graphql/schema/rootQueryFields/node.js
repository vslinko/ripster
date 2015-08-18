import {wrapField, OP_READ} from '../../acl'

export default refs => wrapField(OP_READ, refs.nodeField)
