import React from 'react';
import Relay from 'react-relay';
import {render} from 'react-dom';

import {createHistory} from 'history';
import createStore from './createStore';
import createRouter from './createRouter';

import {Provider} from 'react-redux';

import {AppContainer} from './components/App';

import {loadCurrentLocale} from './flux/locale';
import {readToken} from './flux/token';

async function initApp() {
  try {
    Relay.injectNetworkLayer(
      new Relay.DefaultNetworkLayer('/graphql', {
        credentials: 'same-origin',
      })
    );

    const history = createHistory();
    const store = createStore(history);

    await* [
      store.dispatch(loadCurrentLocale()),
      store.dispatch(readToken()),
    ];

    const router = createRouter(history, store);

    await router.waitQueue();

    render(
      <Provider store={store}>
        <AppContainer />
      </Provider>,
      document.getElementById('app')
    );
  } catch (err) {
    console.log(err.stack); // eslint-disable-line no-console
  }
}

initApp();
