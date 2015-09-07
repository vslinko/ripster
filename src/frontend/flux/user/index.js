import {setToken} from '../token';
import applyMutation from '../../utils/applyMutation';

import CreateSessionMutation from './CreateSessionMutation';
import SetEmailMutation from './SetEmailMutation';

export function authorize({email, password}) {
  return async (dispatch) => {
    const result = await applyMutation(new CreateSessionMutation({email, password}));

    dispatch(setToken(result.createSession.session.sid));
  };
}

export function setEmail({user, email}) {
  return () => applyMutation(new SetEmailMutation({user, email}));
}
