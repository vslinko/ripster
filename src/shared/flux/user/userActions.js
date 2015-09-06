import {setToken} from '../token/tokenActions';
import applyMutation from '../../utils/applyMutation';

import CreateSessionMutation from '../../relay/mutations/CreateSessionMutation';

export function authorize(email, password) {
  return async (dispatch) => {
    const result = await applyMutation(new CreateSessionMutation({email, password}));

    dispatch(setToken(result.createSession.session.sid));
  };
}
