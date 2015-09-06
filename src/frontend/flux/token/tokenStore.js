import createStore from '../../utils/createStore';

import {
  TOKEN,
} from './tokenConstants';

const initialState = null;

export default createStore(initialState, {
  [TOKEN]: (state, {token}) => token,
});
