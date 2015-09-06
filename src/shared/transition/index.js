import {combineTransitions} from 'vstack-router';
import home from './home';

function combineTransitionsWithStore(...transitions) {
  return store => {
    return combineTransitions(
      ...transitions.map(transition => transition(store))
    );
  };
}

export default combineTransitionsWithStore(
  home
);
