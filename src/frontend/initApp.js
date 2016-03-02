import React from 'react';
import { render } from 'react-dom';
import Relay from 'react-relay';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { RelayRouter } from 'react-router-relay';
import createStore from './createStore';
import init from './init';
import routes from './routes';

import { ReduxIntlContainer } from 'frontend/bundles/common/components/ReduxIntl';

export default async function initApp() {
  try {
    Relay.injectNetworkLayer(
      new Relay.DefaultNetworkLayer('/graphql', {
        credentials: 'same-origin',
      })
    );

    const store = createStore();

    await store.dispatch(init());

    const history = syncHistoryWithStore(browserHistory, store);

    const component = (
      <Provider store={store}>
        <ReduxIntlContainer>
          <RelayRouter routes={routes} history={history} />
        </ReduxIntlContainer>
      </Provider>
    );
    const container = document.getElementById('app');

    if (process.env.NODE_ENV !== 'production') {
      window.TestUtils = require('react-addons-test-utils');
      window.Perf = require('react-addons-perf');

      window.Perf.start();
    }

    render(component, container);
  } catch (err) {
    console.log(err.stack); // eslint-disable-line no-console
  }
}
