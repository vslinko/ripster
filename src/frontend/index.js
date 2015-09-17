import 'babel/polyfill';

import React from 'react';
import Relay from 'react-relay';
import {render} from 'react-dom';

import {createHistory} from 'history';
import createStore from './createStore';
import createRouter from './createRouter';

import {Provider} from 'react-redux';

import {AppContainer} from 'frontend/bundles/common/components/App';

import init from './init';

async function initApp() {
  try {
    Relay.injectNetworkLayer(
      new Relay.DefaultNetworkLayer('/graphql', {
        credentials: 'same-origin',
      })
    );

    const history = createHistory();
    const store = createStore(history);

    await store.dispatch(init());

    const router = createRouter(history, store);

    await router.waitQueue();

    const component = (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
    const container = document.getElementById('app');

    if (process.env.NODE_ENV !== 'production') {
      const {DevTools, DebugPanel, LogMonitor} = require('redux-devtools/lib/react');

      render(
        <div>
          {component}
          <DebugPanel top right bottom>
            <DevTools
              store={store}
              monitor={LogMonitor}
              visibleOnLoad={false}
              keyboardEnabled
            />
          </DebugPanel>
        </div>,
        container
      );
    } else {
      render(component, container);
    }
  } catch (err) {
    console.log(err.stack); // eslint-disable-line no-console
  }
}

initApp();
