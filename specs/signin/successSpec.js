import test from 'blue-tape';
import createSeleniumBrowser from '../createSeleniumBrowser';
import { createMarker } from '../marker';

const SignInForm = createMarker('SignInForm');
const HomePage = createMarker('HomePage');

test('signin/success', async (t) => {
  const b = (await createSeleniumBrowser())();

  await b.url('/');
  await b.waitForExist(SignInForm('Form'));

  t.equal(
    await b.getText(HomePage('WelcomeMessage')),
    'anonymous'
  );

  await b.setValue(SignInForm('Email'), 'user1@example.com');
  await b.setValue(SignInForm('Password'), '12345');
  await b.submitForm(SignInForm('Form'));

  t.ok(
    await b.getAttribute(SignInForm('Button'), 'disabled')
  );

  await b.waitForEnabled(SignInForm('Button'));

  t.notok(
    await b.getAttribute(SignInForm('Button'), 'disabled')
  );

  t.equal(
    await b.getText(HomePage('WelcomeMessage')),
    'authorized'
  );
});
