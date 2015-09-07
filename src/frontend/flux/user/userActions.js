import {setToken} from '../token/tokenActions';
import applyMutation from '../../utils/applyMutation';

import CreateSessionMutation from '../../relay/mutations/CreateSessionMutation';
import SetEmailMutation from '../../relay/mutations/SetEmailMutation';

export function authorize({email, password}) {
  return async (dispatch) => {
    const result = await applyMutation(new CreateSessionMutation({email, password}));

    dispatch(setToken(result.createSession.session.sid));
  };
}

export function setEmail({user, email}) {
  return () => applyMutation(new SetEmailMutation({user, email}));
}
