import test from 'blue-tape';
import createStore from 'frontend/createStore';

test('frontend/createStore', (t) => {
  const store = createStore();

  t.ok(store.dispatch);
  t.ok(store.getState);

  t.end();
});
