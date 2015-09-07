import applyMutation from 'frontend/utils/applyMutation';

import SetEmailMutation from './mutations/SetEmailMutation';

export function setEmail({user, email}) {
  return () => applyMutation(new SetEmailMutation({user, email}));
}
