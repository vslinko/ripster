import {wrapField, OP_READ} from '../../acl'

export default refs => wrapField(OP_READ, {
  type: refs.user,
  resolve: (root, args, context) => context.user
})
