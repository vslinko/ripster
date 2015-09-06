import getAllUsers from '../../queries/user/getAllUsers';
import {wrapConnectionField} from '../../acl';

export default refs => wrapConnectionField({
  type: refs.userConnection,
  resolve: () => getAllUsers(),
});
