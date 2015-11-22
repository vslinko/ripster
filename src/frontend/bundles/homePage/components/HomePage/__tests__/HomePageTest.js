import test from 'blue-tape';
import {renderComponent, findRenderedDOMComponentWithMarker} from 'frontend/utils/testUtils';

import HomePage from '../HomePage';

test('frontend/bundles/homePage/components/HomePage/HomePage', (t) => {
  const homePage = renderComponent(HomePage, {
    welcomeMessage: 'welcome',
  });

  const welcome = findRenderedDOMComponentWithMarker(
    homePage,
    'HomePage-Welcome'
  );

  t.ok(welcome);
  t.equal(welcome.textContent, 'welcome');

  t.end();
});
