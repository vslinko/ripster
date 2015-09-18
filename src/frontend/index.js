import 'babel/polyfill';

import React from 'react';
import {render} from 'react-dom';
import Relay from 'react-relay';
import {Provider} from 'react-redux';
import {ReduxRouter} from 'redux-react-router';
import ReactRouterRelay from 'react-router-relay';
import createStore from './createStore';
import init from './init';

async function initApp() {
  try {
    Relay.injectNetworkLayer(
      new Relay.DefaultNetworkLayer('/graphql', {
        credentials: 'same-origin',
      })
    );

    const store = createStore();

    await store.dispatch(init());

    const component = (
      <Provider store={store}>
        <ReduxRouter
          createElement={ReactRouterRelay.createElement}
        />
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
