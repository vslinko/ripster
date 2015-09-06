import {createTransition} from 'vstack-router';
import {homeTransition} from '../flux/transition/transitionActions';

function createStoreTransition(pattern, transitionHandler) {
  return store => {
    return createTransition(pattern, query => {
      return store.dispatch(transitionHandler(query));
    });
  };
}

export default createStoreTransition('/', homeTransition);
